/**
 * Backfill Sale stock movements for fulfilled order lines that never got one.
 *
 * Background: because `customOrderProcess` replaced the `ArrangingPayment`
 * transitions, `DefaultStockAllocationStrategy` never fired, so no `Allocation`
 * rows were written. `StockLocationStrategy.forSale()` derives sale locations
 * from the Allocation table, so `createSalesForOrder()` produced nothing and
 * `stockOnHand` was never decremented. See `stock-allocation-strategy.ts`.
 *
 * This script repairs the historical data left behind by that bug.
 *
 * Usage:
 *   ts-node src/scripts/backfill-stock-sales.ts               # dry run (default, writes nothing)
 *   ts-node src/scripts/backfill-stock-sales.ts --apply       # apply inside one transaction
 *   ts-node src/scripts/backfill-stock-sales.ts --revert <receipt.json>
 *
 * Flags:
 *   --apply             Perform the writes. Without it nothing is written.
 *   --allow-negative    Permit results that drive stockOnHand below zero.
 *   --receipt <path>    Where to write the receipt (default: ./backfill-receipt-<timestamp>.json).
 */
import { DataSource, DataSourceOptions } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { config } from "../vendure-config";

type Candidate = {
  orderId: number;
  orderCode: string;
  orderState: string;
  orderLineId: number;
  productVariantId: number;
  variantName: string;
  fulfillmentId: number;
  fulfillmentState: string;
  quantity: number;
  trackInventory: string;
  stockLevelId: number | null;
  stockLocationId: number | null;
  stockOnHand: number | null;
  stockLevelCount: number;
};

type ReceiptEntry = {
  stockMovementId: number;
  orderLineId: number;
  productVariantId: number;
  stockLevelId: number;
  quantity: number;
  stockOnHandBefore: number;
  stockOnHandAfter: number;
};

type Receipt = {
  createdAt: string;
  database: string;
  entries: ReceiptEntry[];
};

/**
 * Anchors on FulfillmentLine rather than Order.state. A Sale is what Vendure
 * would have written when a Fulfillment transitioned Created -> Pending, so
 * fulfilled lines are exactly the set that should have been decremented.
 * Cancelled orders have no fulfillments and are therefore excluded by
 * construction, rather than by an easily-mistaken state whitelist.
 */
const CANDIDATE_QUERY = `
  SELECT
    o.id                    AS "orderId",
    o.code                  AS "orderCode",
    o.state                 AS "orderState",
    ol.id                   AS "orderLineId",
    ol."productVariantId"   AS "productVariantId",
    COALESCE(pvt.name, '')  AS "variantName",
    f.id                    AS "fulfillmentId",
    f.state                 AS "fulfillmentState",
    olr.quantity            AS "quantity",
    pv."trackInventory"     AS "trackInventory",
    sl.id                   AS "stockLevelId",
    sl."stockLocationId"    AS "stockLocationId",
    sl."stockOnHand"        AS "stockOnHand",
    (SELECT count(*) FROM stock_level x WHERE x."productVariantId" = ol."productVariantId") AS "stockLevelCount"
  FROM order_line_reference olr
  JOIN fulfillment f                      ON f.id = olr."fulfillmentId"
  JOIN order_line ol                      ON ol.id = olr."orderLineId"
  JOIN order_fulfillments_fulfillment off ON off."fulfillmentId" = f.id
  JOIN "order" o                          ON o.id = off."orderId"
  JOIN product_variant pv                 ON pv.id = ol."productVariantId"
  LEFT JOIN product_variant_translation pvt
         ON pvt."baseId" = pv.id AND pvt."languageCode" = 'en'
  LEFT JOIN stock_level sl
         ON sl."productVariantId" = ol."productVariantId"
        AND (SELECT count(*) FROM stock_level x WHERE x."productVariantId" = ol."productVariantId") = 1
  WHERE olr.discriminator = 'FulfillmentLine'
    AND f.state <> 'Cancelled'
    AND NOT EXISTS (
      SELECT 1 FROM stock_movement sm
      WHERE sm."orderLineId" = ol.id AND sm.discriminator = 'Sale'
    )
  ORDER BY o.id, ol.id
`;

function buildDataSource(): DataSource {
  const opts = config.dbConnectionOptions as DataSourceOptions;
  return new DataSource({ ...opts, entities: [], migrations: [], synchronize: false, logging: false } as DataSourceOptions);
}

function tracksInventory(candidate: Candidate, globalTrackInventory: boolean): boolean {
  return candidate.trackInventory === "TRUE" || (candidate.trackInventory === "INHERIT" && globalTrackInventory);
}

function pad(value: string | number, width: number): string {
  return String(value).padEnd(width).slice(0, width - 1) + " ";
}

/**
 * TypeORM's `query()` returns bare rows for INSERT..RETURNING but
 * `[rows, affectedCount]` for DELETE/UPDATE..RETURNING. Normalise to rows so
 * callers can trust `.length`.
 */
function returnedRows(result: any): any[] {
  if (!Array.isArray(result)) {
    return [];
  }
  if (result.length === 2 && Array.isArray(result[0]) && typeof result[1] === "number") {
    return result[0];
  }
  return result;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  const allowNegative = argv.includes("--allow-negative");
  const revertIndex = argv.indexOf("--revert");
  const receiptIndex = argv.indexOf("--receipt");

  const dataSource = await buildDataSource().initialize();
  const dbName = (config.dbConnectionOptions as any).database;

  try {
    if (revertIndex !== -1) {
      await revert(dataSource, argv[revertIndex + 1]);
      return;
    }

    const rows: any[] = await dataSource.query(CANDIDATE_QUERY);
    const candidates: Candidate[] = rows.map(r => ({
      ...r,
      orderId: Number(r.orderId),
      orderLineId: Number(r.orderLineId),
      productVariantId: Number(r.productVariantId),
      fulfillmentId: Number(r.fulfillmentId),
      quantity: Number(r.quantity),
      stockLevelId: r.stockLevelId === null ? null : Number(r.stockLevelId),
      stockLocationId: r.stockLocationId === null ? null : Number(r.stockLocationId),
      stockOnHand: r.stockOnHand === null ? null : Number(r.stockOnHand),
      stockLevelCount: Number(r.stockLevelCount),
    }));

    const [globalSettings] = await dataSource.query(`SELECT "trackInventory" FROM global_settings ORDER BY id LIMIT 1`);
    const globalTrackInventory = globalSettings?.trackInventory === true;

    console.log(`\nDatabase: ${dbName}`);
    console.log(`Global trackInventory: ${globalTrackInventory}`);
    console.log(`Fulfilled order lines with no Sale movement: ${candidates.length}\n`);

    if (candidates.length === 0) {
      console.log("Nothing to backfill.");
      return;
    }

    const actionable: Candidate[] = [];
    const skipped: Array<{ candidate: Candidate; reason: string }> = [];

    for (const c of candidates) {
      if (!tracksInventory(c, globalTrackInventory)) {
        skipped.push({ candidate: c, reason: `inventory not tracked (trackInventory=${c.trackInventory})` });
      } else if (c.stockLevelCount === 0) {
        skipped.push({ candidate: c, reason: "no stock_level row for variant" });
      } else if (c.stockLevelCount > 1) {
        skipped.push({ candidate: c, reason: `${c.stockLevelCount} stock locations — needs manual allocation` });
      } else {
        actionable.push(c);
      }
    }

    // Several fulfilled lines can point at the same variant, so track the
    // running stockOnHand to report the true final value, not a per-row delta.
    const runningStock = new Map<number, number>();
    const planned: Array<{ candidate: Candidate; before: number; after: number }> = [];
    for (const c of actionable) {
      const before = runningStock.get(c.stockLevelId as number) ?? (c.stockOnHand as number);
      const after = before - c.quantity;
      runningStock.set(c.stockLevelId as number, after);
      planned.push({ candidate: c, before, after });
    }

    console.log(
      `${pad("ORDER", 18)}${pad("STATE", 17)}${pad("LINE", 6)}${pad("VARIANT", 9)}${pad("QTY", 5)}${pad("ON HAND", 9)}${pad("->", 4)}RESULT`
    );
    console.log("-".repeat(81));
    for (const p of planned) {
      const flag = p.after < 0 ? "  << NEGATIVE" : "";
      console.log(
        `${pad(p.candidate.orderCode, 18)}${pad(p.candidate.orderState, 17)}${pad(p.candidate.orderLineId, 6)}` +
          `${pad(p.candidate.productVariantId, 9)}${pad(p.candidate.quantity, 5)}${pad(p.before, 9)}${pad("->", 4)}${p.after}${flag}`
      );
    }

    if (skipped.length) {
      console.log(`\nSkipped (${skipped.length}):`);
      for (const s of skipped) {
        console.log(`  order ${s.candidate.orderCode} line ${s.candidate.orderLineId}: ${s.reason}`);
      }
    }

    const negatives = planned.filter(p => p.after < 0);
    if (negatives.length && !allowNegative) {
      console.log(
        `\nABORT: ${negatives.length} line(s) would drive stockOnHand below zero.` +
          `\nThat usually means stock was corrected by hand after the order shipped.` +
          `\nReview those variants, then re-run with --allow-negative to proceed anyway.`
      );
      process.exitCode = 1;
      return;
    }

    if (!apply) {
      console.log(`\nDRY RUN — nothing was written. Re-run with --apply to perform ${planned.length} correction(s).`);
      return;
    }

    const receiptPath =
      receiptIndex !== -1
        ? argv[receiptIndex + 1]
        : path.resolve(process.cwd(), `backfill-receipt-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);

    const entries: ReceiptEntry[] = [];
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const p of planned) {
        const c = p.candidate;
        // Sale.quantity is stored negative, matching StockMovementService.createSalesForOrder().
        const insertResult = await queryRunner.query(
          `INSERT INTO stock_movement
             ("createdAt","updatedAt","type","quantity","discriminator","productVariantId","orderLineId","stockLocationId")
           VALUES (now(), now(), 'SALE', $1, 'Sale', $2, $3, $4)
           RETURNING id`,
          [-c.quantity, c.productVariantId, c.orderLineId, c.stockLocationId]
        );
        const [inserted] = returnedRows(insertResult);
        if (!inserted?.id) {
          throw new Error(`Insert of Sale movement for order line ${c.orderLineId} returned no id`);
        }
        // Only stockOnHand moves. Vendure also decrements stockAllocated here,
        // but these orders were never allocated (stockAllocated is 0), so
        // decrementing it would drive it negative.
        await queryRunner.query(
          `UPDATE stock_level SET "stockOnHand" = "stockOnHand" - $1, "updatedAt" = now() WHERE id = $2`,
          [c.quantity, c.stockLevelId]
        );
        entries.push({
          stockMovementId: Number(inserted.id),
          orderLineId: c.orderLineId,
          productVariantId: c.productVariantId,
          stockLevelId: c.stockLevelId as number,
          quantity: c.quantity,
          stockOnHandBefore: p.before,
          stockOnHandAfter: p.after,
        });
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    const receipt: Receipt = { createdAt: new Date().toISOString(), database: dbName, entries };
    fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2), "utf-8");
    console.log(`\nApplied ${entries.length} correction(s).`);
    console.log(`Receipt written to ${receiptPath}`);
    console.log(`Revert with: ts-node src/scripts/backfill-stock-sales.ts --revert ${receiptPath}`);
  } finally {
    await dataSource.destroy();
  }
}

async function revert(dataSource: DataSource, receiptPath: string): Promise<void> {
  if (!receiptPath) {
    throw new Error("--revert requires a receipt file path");
  }
  const receipt: Receipt = JSON.parse(fs.readFileSync(receiptPath, "utf-8"));
  console.log(`\nReverting ${receipt.entries.length} correction(s) from ${receiptPath} (applied ${receipt.createdAt})\n`);

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    let reverted = 0;
    for (const entry of receipt.entries) {
      // Only undo movements this receipt created and that still exist, so a
      // partially-reverted receipt can be re-run safely.
      const deleted = returnedRows(
        await queryRunner.query(`DELETE FROM stock_movement WHERE id = $1 AND discriminator = 'Sale' RETURNING id`, [
          entry.stockMovementId,
        ])
      );
      if (deleted.length === 0) {
        console.log(`  skip: stock_movement ${entry.stockMovementId} already gone`);
        continue;
      }
      await queryRunner.query(
        `UPDATE stock_level SET "stockOnHand" = "stockOnHand" + $1, "updatedAt" = now() WHERE id = $2`,
        [entry.quantity, entry.stockLevelId]
      );
      reverted++;
    }
    await queryRunner.commitTransaction();
    console.log(`\nReverted ${reverted} correction(s).`);
  } catch (e) {
    await queryRunner.rollbackTransaction();
    throw e;
  } finally {
    await queryRunner.release();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
