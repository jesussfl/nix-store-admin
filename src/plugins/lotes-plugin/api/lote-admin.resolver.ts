import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, PaginatedList, Permission, RequestContext, Transaction } from "@vendure/core";

import { Lote } from "../entities/lote.entity";
import { LoteService } from "../services/lote.service";

@Resolver()
export class LoteAdminResolver {
  constructor(private loteService: LoteService) {}

  /**
   * Retrieves all Lotes.
   */
  @Query()
  @Allow(Permission.ReadCatalog) // Replace with appropriate permissions
  async allLotes(@Ctx() ctx: RequestContext, @Args() args: any): Promise<PaginatedList<Lote>> {
    return this.loteService.findAll(ctx, args.options || undefined);
  }

  @Query()
  @Allow(Permission.ReadCatalog) // Replace with appropriate permissions
  async getLote(@Ctx() ctx: RequestContext, @Args("loteId") loteId: string): Promise<Lote | undefined> {
    const lote = await this.loteService.findOne(ctx, loteId);
    if (!lote) {
      throw new Error(`Lote with ID ${loteId} not found`);
    }
    return lote;
  }

  /**
   * Creates a new Lote.
   */
  @Mutation()
  @Transaction()
  @Allow(Permission.CreateCatalog) // Replace with appropriate permissions
  async createLote(@Ctx() ctx: RequestContext, @Args("input") input: { name: string; description: string }): Promise<Lote> {
    return this.loteService.create(ctx, input.name, input.description);
  }

  /**
   * Updates an existing Lote.
   */
  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog) // Replace with appropriate permissions
  async updateLote(@Ctx() ctx: RequestContext, @Args("loteId") loteId: string, @Args("input") input: { name: string; description: string }): Promise<Lote> {
    return this.loteService.update(ctx, loteId, input.name, input.description);
  }

  /**
   * Deletes a Lote by its ID.
   */
  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog) // Replace with appropriate permissions
  async deleteLote(@Ctx() ctx: RequestContext, @Args("loteId") loteId: string): Promise<boolean> {
    return this.loteService.delete(ctx, loteId);
  }
}
