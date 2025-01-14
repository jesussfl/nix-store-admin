import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { Order, TransactionalConnection } from "@vendure/core";
import { Lote } from "../entities/lote.entity";

@Resolver("Order")
export class OrderEntityResolver {
  constructor(private connection: TransactionalConnection) {}

  @ResolveField()
  async lote(@Parent() order: Order): Promise<Lote | null> {
    const lote = await this.connection.getRepository(Lote).findOne(order.customFields.loteId);
    return lote || null;
  }
}
