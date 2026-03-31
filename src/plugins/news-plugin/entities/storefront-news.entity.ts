import { Asset, DeepPartial, VendureEntity } from "@vendure/core";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class StorefrontNews extends VendureEntity {
  constructor(input?: DeepPartial<StorefrontNews>) {
    super(input);
  }

  @Column()
  title: string;

  @Column("text")
  summary: string;

  @ManyToOne(() => Asset, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  imageAsset: Asset | null;

  @Column("varchar", { nullable: true })
  ctaText: string | null;

  @Column("varchar", { nullable: true })
  ctaLink: string | null;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isPublished: boolean;
}
