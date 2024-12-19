import { VendureEntity, DeepPartial } from "@vendure/core";
import { Column, Entity } from "typeorm";

@Entity()
export class Lote extends VendureEntity {
  constructor(input?: DeepPartial<Lote>) {
    super(input);
  }

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}
