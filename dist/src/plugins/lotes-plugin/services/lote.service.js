"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoteService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@vendure/core");
const lote_entity_1 = require("../entities/lote.entity");
let LoteService = class LoteService {
    constructor(connection, listQueryBuilder) {
        this.connection = connection;
        this.listQueryBuilder = listQueryBuilder;
    }
    /**
     * Retrieves all Lotes.
     */
    async findAll(ctx, options) {
        return this.listQueryBuilder
            .build(lote_entity_1.Lote, options, {
            ctx,
        })
            .getManyAndCount()
            .then(([items, totalItems]) => ({ items, totalItems }));
    }
    async findLastLote(ctx) {
        return this.connection
            .getRepository(ctx, lote_entity_1.Lote)
            .createQueryBuilder("lote")
            .orderBy("lote.createdAt", "DESC") // Adjust the field to suit your schema
            .addOrderBy("lote.id", "DESC") // Secondary ordering by ID (if necessary)
            .getOne();
    }
    /**
     * Creates a new Lote with the given name and description.
     */
    async create(ctx, name, description) {
        const lote = new lote_entity_1.Lote();
        lote.name = name;
        lote.description = description;
        return this.connection.getRepository(ctx, lote_entity_1.Lote).save(lote);
    }
    /**
     * Finds a Lote by its ID.
     */
    async findOne(ctx, loteId) {
        return this.connection.getRepository(ctx, lote_entity_1.Lote).findOne({
            where: {
                id: loteId,
            },
        });
    }
    /**
     * Updates a Lote's name and description.
     */
    async update(ctx, loteId, name, description) {
        const lote = await this.findOne(ctx, loteId);
        if (!lote) {
            throw new Error(`Lote with ID ${loteId} not found`);
        }
        lote.name = name;
        lote.description = description;
        return this.connection.getRepository(ctx, lote_entity_1.Lote).save(lote);
    }
    /**
     * Deletes a Lote by its ID.
     */
    async delete(ctx, loteId) {
        const lote = await this.findOne(ctx, loteId);
        if (!lote) {
            throw new Error(`Lote with ID ${loteId} not found`);
        }
        await this.connection.getRepository(ctx, lote_entity_1.Lote).remove(lote);
        return true;
    }
};
exports.LoteService = LoteService;
exports.LoteService = LoteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.TransactionalConnection, core_1.ListQueryBuilder])
], LoteService);
