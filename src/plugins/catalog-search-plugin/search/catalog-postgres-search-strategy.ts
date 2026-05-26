import {
  LogicalOperator,
  SearchResult,
} from "@vendure/common/lib/generated-types";
import { ID } from "@vendure/common/lib/shared-types";
import {
  RequestContext,
  TransactionalConnection,
  UserInputError,
} from "@vendure/core";
import { Injector } from "@vendure/core/dist/common";
import { Product } from "@vendure/core/dist/entity/product/product.entity";
import { PLUGIN_INIT_OPTIONS } from "@vendure/core/dist/plugin/default-search-plugin/constants";
import { SearchIndexItem } from "@vendure/core/dist/plugin/default-search-plugin/entities/search-index-item.entity";
import { SearchStrategy } from "@vendure/core/dist/plugin/default-search-plugin/search-strategy/search-strategy";
import { getFieldsToSelect } from "@vendure/core/dist/plugin/default-search-plugin/search-strategy/search-strategy-common";
import {
  applyLanguageConstraints,
  createCollectionIdCountMap,
  createFacetIdCountMap,
  createPlaceholderFromId,
  mapToSearchResult,
} from "@vendure/core/dist/plugin/default-search-plugin/search-strategy/search-strategy-utils";
import {
  DefaultSearchPluginInitOptions,
  SearchInput,
} from "@vendure/core/dist/plugin/default-search-plugin/types";
import { Brackets, SelectQueryBuilder } from "typeorm";

type CatalogSearchSort = NonNullable<SearchInput["sort"]> & {
  createdAt?: "ASC" | "DESC";
};

/**
 * Extends Vendure's Postgres default search strategy with product.createdAt sorting.
 */
export class CatalogPostgresSearchStrategy implements SearchStrategy {
  private readonly minTermLength = 2;
  private connection: TransactionalConnection;
  private options: DefaultSearchPluginInitOptions;

  async init(injector: Injector) {
    this.connection = injector.get(TransactionalConnection);
    this.options = injector.get(PLUGIN_INIT_OPTIONS);
  }

  async getFacetValueIds(
    ctx: RequestContext,
    input: SearchInput,
    enabledOnly: boolean,
  ): Promise<Map<ID, number>> {
    const facetValuesQb = this.connection
      .getRepository(ctx, SearchIndexItem)
      .createQueryBuilder("si")
      .select(['"si"."productId"', 'MAX("si"."productVariantId")'])
      .addSelect('string_agg("si"."facetValueIds",\',\')', "facetValues");
    this.applyTermAndFilters(ctx, facetValuesQb, input, true);
    if (!input.groupByProduct) {
      facetValuesQb.groupBy('"si"."productVariantId", "si"."productId"');
    }
    if (enabledOnly) {
      facetValuesQb.andWhere('"si"."enabled" = :enabled', { enabled: true });
    }
    const facetValuesResult = await facetValuesQb.getRawMany();
    return createFacetIdCountMap(facetValuesResult);
  }

  async getCollectionIds(
    ctx: RequestContext,
    input: SearchInput,
    enabledOnly: boolean,
  ): Promise<Map<ID, number>> {
    const collectionsQb = this.connection
      .getRepository(ctx, SearchIndexItem)
      .createQueryBuilder("si")
      .select(['"si"."productId"', 'MAX("si"."productVariantId")'])
      .addSelect('string_agg("si"."collectionIds",\',\')', "collections");
    this.applyTermAndFilters(ctx, collectionsQb, input, true);
    if (!input.groupByProduct) {
      collectionsQb.groupBy('"si"."productVariantId", "si"."productId"');
    }
    if (enabledOnly) {
      collectionsQb.andWhere('"si"."enabled" = :enabled', { enabled: true });
    }
    const collectionsResult = await collectionsQb.getRawMany();
    return createCollectionIdCountMap(collectionsResult);
  }

  async getSearchResults(
    ctx: RequestContext,
    input: SearchInput,
    enabledOnly: boolean,
  ): Promise<SearchResult[]> {
    const take = input.take || 25;
    const skip = input.skip || 0;
    const sort = input.sort as CatalogSearchSort | undefined;
    const qb = this.connection
      .getRepository(ctx, SearchIndexItem)
      .createQueryBuilder("si")
      .leftJoin(Product, "product", "product.id = si.productId")
      .select(this.createPostgresSelect(!!input.groupByProduct));

    if (input.groupByProduct) {
      qb.addSelect("MIN(si.price)", "minPrice")
        .addSelect("MAX(si.price)", "maxPrice")
        .addSelect("MIN(si.priceWithTax)", "minPriceWithTax")
        .addSelect("MAX(si.priceWithTax)", "maxPriceWithTax")
        .addSelect("MIN(product.createdAt)", "productCreatedAt");
    } else {
      qb.addSelect("product.createdAt", "productCreatedAt");
    }

    this.applyTermAndFilters(ctx, qb, input);
    if (sort) {
      if (sort.createdAt) {
        qb.addOrderBy('"productCreatedAt"', sort.createdAt);
      }
      if (sort.name) {
        qb.addOrderBy('"si_productName"', sort.name);
      }
      if (sort.price) {
        qb.addOrderBy('"si_price"', sort.price);
      }
    } else if (input.term && input.term.length > this.minTermLength) {
      qb.addOrderBy("score", "DESC");
    }
    qb.addOrderBy('"si_productVariantId"', "ASC");
    if (enabledOnly) {
      qb.andWhere('"si"."enabled" = :enabled', { enabled: true });
    }
    return qb
      .limit(take)
      .offset(skip)
      .getRawMany()
      .then((res) =>
        res.map((r) => mapToSearchResult(r, ctx.channel.defaultCurrencyCode)),
      );
  }

  async getTotalCount(
    ctx: RequestContext,
    input: SearchInput,
    enabledOnly: boolean,
  ): Promise<number> {
    const innerQb = this.applyTermAndFilters(
      ctx,
      this.connection
        .getRepository(ctx, SearchIndexItem)
        .createQueryBuilder("si")
        .select(this.createPostgresSelect(!!input.groupByProduct)),
      input,
    );
    if (enabledOnly) {
      innerQb.andWhere('"si"."enabled" = :enabled', { enabled: true });
    }

    const totalItemsQb = this.connection.rawConnection
      .createQueryBuilder()
      .select("COUNT(*) as total")
      .from(`(${innerQb.getQuery()})`, "inner")
      .setParameters(innerQb.getParameters());
    return totalItemsQb.getRawOne().then((res) => res.total);
  }

  private applyTermAndFilters(
    ctx: RequestContext,
    qb: SelectQueryBuilder<SearchIndexItem>,
    input: SearchInput,
    forceGroup = false,
  ): SelectQueryBuilder<SearchIndexItem> {
    const {
      term,
      facetValueFilters,
      facetValueIds,
      facetValueOperator,
      collectionId,
      collectionSlug,
    } = input;
    const termLogicalAnd = term
      ? term
          .trim()
          .split(/\s+/g)
          .map((t) => `'${t}':*`)
          .join(" & ")
      : "";

    qb.where("1 = 1");
    if (term && term.length > this.minTermLength) {
      const minIfGrouped = (colName: string) =>
        input.groupByProduct || forceGroup ? `MIN(${colName})` : colName;
      qb.addSelect(
        `
                    (ts_rank_cd(to_tsvector(${minIfGrouped("si.sku")}), to_tsquery(:term)) * 10 +
                    ts_rank_cd(to_tsvector(${minIfGrouped("si.productName")}), to_tsquery(:term)) * 2 +
                    ts_rank_cd(to_tsvector(${minIfGrouped("si.productVariantName")}), to_tsquery(:term)) * 1.5 +
                    ts_rank_cd(to_tsvector(${minIfGrouped("si.description")}), to_tsquery(:term)) * 1)
                            `,
        "score",
      )
        .andWhere(
          new Brackets((qb1) => {
            qb1
              .where("to_tsvector(si.sku) @@ to_tsquery(:term)")
              .orWhere("to_tsvector(si.productName) @@ to_tsquery(:term)")
              .orWhere(
                "to_tsvector(si.productVariantName) @@ to_tsquery(:term)",
              )
              .orWhere("to_tsvector(si.description) @@ to_tsquery(:term)");
          }),
        )
        .setParameters({ term: termLogicalAnd });
    }

    if (input.inStock != null) {
      if (input.groupByProduct) {
        qb.andWhere("si.productInStock = :inStock", { inStock: input.inStock });
      } else {
        qb.andWhere("si.inStock = :inStock", { inStock: input.inStock });
      }
    }
    if (facetValueIds?.length) {
      qb.andWhere(
        new Brackets((qb1) => {
          for (const id of facetValueIds) {
            const placeholder = createPlaceholderFromId(id);
            const clause = `:${placeholder}::varchar = ANY (string_to_array(si.facetValueIds, ','))`;
            const params = { [placeholder]: id };
            if (facetValueOperator === LogicalOperator.AND) {
              qb1.andWhere(clause, params);
            } else {
              qb1.orWhere(clause, params);
            }
          }
        }),
      );
    }
    if (facetValueFilters?.length) {
      qb.andWhere(
        new Brackets((qb1) => {
          for (const facetValueFilter of facetValueFilters) {
            qb1.andWhere(
              new Brackets((qb2) => {
                if (facetValueFilter.and && facetValueFilter.or?.length) {
                  throw new UserInputError(
                    "error.facetfilterinput-invalid-input",
                  );
                }
                if (facetValueFilter.and) {
                  const placeholder = createPlaceholderFromId(
                    facetValueFilter.and,
                  );
                  const clause = `:${placeholder}::varchar = ANY (string_to_array(si.facetValueIds, ','))`;
                  const params = { [placeholder]: facetValueFilter.and };
                  qb2.where(clause, params);
                }
                if (facetValueFilter.or?.length) {
                  for (const id of facetValueFilter.or) {
                    const placeholder = createPlaceholderFromId(id);
                    const clause = `:${placeholder}::varchar = ANY (string_to_array(si.facetValueIds, ','))`;
                    const params = { [placeholder]: id };
                    qb2.orWhere(clause, params);
                  }
                }
              }),
            );
          }
        }),
      );
    }
    if (collectionId) {
      qb.andWhere(
        ":collectionId::varchar = ANY (string_to_array(si.collectionIds, ','))",
        {
          collectionId,
        },
      );
    }
    if (collectionSlug) {
      qb.andWhere(
        ":collectionSlug::varchar = ANY (string_to_array(si.collectionSlugs, ','))",
        {
          collectionSlug,
        },
      );
    }
    qb.andWhere("si.channelId = :channelId", { channelId: ctx.channelId });
    applyLanguageConstraints(
      qb,
      ctx.languageCode,
      ctx.channel.defaultLanguageCode,
    );
    if (input.groupByProduct === true) {
      qb.groupBy("si.productId");
    }
    return qb;
  }

  private createPostgresSelect(groupByProduct: boolean): string {
    return getFieldsToSelect(this.options.indexStockStatus)
      .map((col) => {
        const qualifiedName = `si.${col}`;
        const alias = `si_${col}`;
        if (groupByProduct && col !== "productId") {
          if (
            col === "facetIds" ||
            col === "facetValueIds" ||
            col === "collectionIds" ||
            col === "channelIds"
          ) {
            return `string_agg(${qualifiedName}, ',') as "${alias}"`;
          }
          if (
            col === "enabled" ||
            col === "inStock" ||
            col === "productInStock"
          ) {
            return `bool_or(${qualifiedName}) as "${alias}"`;
          }
          return `MIN(${qualifiedName}) as "${alias}"`;
        }
        return `${qualifiedName} as "${alias}"`;
      })
      .join(", ");
  }
}
