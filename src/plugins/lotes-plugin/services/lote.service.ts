import { Injectable } from "@nestjs/common";
import { RequestContext, TransactionalConnection, ID, ListQueryBuilder, ListQueryOptions, PaginatedList } from "@vendure/core";
import { Lote } from "../entities/lote.entity";

@Injectable()
export class LoteService {
  constructor(private connection: TransactionalConnection, private listQueryBuilder: ListQueryBuilder) {}

  /**
   * Retrieves all Lotes.
   */
  async findAll(ctx: RequestContext, options?: ListQueryOptions<Lote>): Promise<PaginatedList<Lote>> {
    return this.listQueryBuilder
      .build(Lote, options, {
        ctx,
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({ items, totalItems }));
  }

  /**
   * Creates a new Lote with the given name and description.
   */
  async create(ctx: RequestContext, name: string, description: string): Promise<Lote> {
    const lote = new Lote();
    lote.name = name;
    lote.description = description;
    return this.connection.getRepository(ctx, Lote).save(lote);
  }

  /**
   * Finds a Lote by its ID.
   */
  async findOne(ctx: RequestContext, loteId: ID): Promise<Lote | null> {
    return this.connection.getRepository(ctx, Lote).findOne({ where: { id: loteId } });
  }

  /**
   * Updates a Lote's name and description.
   */
  async update(ctx: RequestContext, loteId: ID, name: string, description: string): Promise<Lote> {
    const lote = await this.findOne(ctx, loteId);
    if (!lote) {
      throw new Error(`Lote with ID ${loteId} not found`);
    }
    lote.name = name;
    lote.description = description;
    return this.connection.getRepository(ctx, Lote).save(lote);
  }

  /**
   * Deletes a Lote by its ID.
   */
  async delete(ctx: RequestContext, loteId: ID): Promise<boolean> {
    const lote = await this.findOne(ctx, loteId);
    if (!lote) {
      throw new Error(`Lote with ID ${loteId} not found`);
    }
    await this.connection.getRepository(ctx, Lote).remove(lote);
    return true;
  }
}
