"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogPostgresSearchStrategy = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const core_1 = require("@vendure/core");
const product_entity_1 = require("@vendure/core/dist/entity/product/product.entity");
const constants_1 = require("@vendure/core/dist/plugin/default-search-plugin/constants");
const search_index_item_entity_1 = require("@vendure/core/dist/plugin/default-search-plugin/entities/search-index-item.entity");
const search_strategy_common_1 = require("@vendure/core/dist/plugin/default-search-plugin/search-strategy/search-strategy-common");
const search_strategy_utils_1 = require("@vendure/core/dist/plugin/default-search-plugin/search-strategy/search-strategy-utils");
const typeorm_1 = require("typeorm");
/**
 * Extends Vendure's Postgres default search strategy with product.createdAt sorting.
 */
class CatalogPostgresSearchStrategy {
    constructor() {
        this.minTermLength = 2;
    }
    async init(injector) {
        this.connection = injector.get(core_1.TransactionalConnection);
        this.options = injector.get(constants_1.PLUGIN_INIT_OPTIONS);
    }
    async getFacetValueIds(ctx, input, enabledOnly) {
        const facetValuesQb = this.connection
            .getRepository(ctx, search_index_item_entity_1.SearchIndexItem)
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
        return (0, search_strategy_utils_1.createFacetIdCountMap)(facetValuesResult);
    }
    async getCollectionIds(ctx, input, enabledOnly) {
        const collectionsQb = this.connection
            .getRepository(ctx, search_index_item_entity_1.SearchIndexItem)
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
        return (0, search_strategy_utils_1.createCollectionIdCountMap)(collectionsResult);
    }
    async getSearchResults(ctx, input, enabledOnly) {
        const take = input.take || 25;
        const skip = input.skip || 0;
        const sort = input.sort;
        const qb = this.connection
            .getRepository(ctx, search_index_item_entity_1.SearchIndexItem)
            .createQueryBuilder("si")
            .leftJoin(product_entity_1.Product, "product", "product.id = si.productId")
            .select(this.createPostgresSelect(!!input.groupByProduct));
        if (input.groupByProduct) {
            qb.addSelect("MIN(si.price)", "minPrice")
                .addSelect("MAX(si.price)", "maxPrice")
                .addSelect("MIN(si.priceWithTax)", "minPriceWithTax")
                .addSelect("MAX(si.priceWithTax)", "maxPriceWithTax")
                .addSelect("MIN(product.createdAt)", "productCreatedAt");
        }
        else {
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
        }
        else if (input.term && input.term.length > this.minTermLength) {
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
            .then((res) => res.map((r) => (0, search_strategy_utils_1.mapToSearchResult)(r, ctx.channel.defaultCurrencyCode)));
    }
    async getTotalCount(ctx, input, enabledOnly) {
        const innerQb = this.applyTermAndFilters(ctx, this.connection
            .getRepository(ctx, search_index_item_entity_1.SearchIndexItem)
            .createQueryBuilder("si")
            .select(this.createPostgresSelect(!!input.groupByProduct)), input);
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
    applyTermAndFilters(ctx, qb, input, forceGroup = false) {
        const { term, facetValueFilters, facetValueIds, facetValueOperator, collectionId, collectionSlug, } = input;
        const termLogicalAnd = term
            ? term
                .trim()
                .split(/\s+/g)
                .map((t) => `'${t}':*`)
                .join(" & ")
            : "";
        qb.where("1 = 1");
        if (term && term.length > this.minTermLength) {
            const minIfGrouped = (colName) => input.groupByProduct || forceGroup ? `MIN(${colName})` : colName;
            qb.addSelect(`
                    (ts_rank_cd(to_tsvector(${minIfGrouped("si.sku")}), to_tsquery(:term)) * 10 +
                    ts_rank_cd(to_tsvector(${minIfGrouped("si.productName")}), to_tsquery(:term)) * 2 +
                    ts_rank_cd(to_tsvector(${minIfGrouped("si.productVariantName")}), to_tsquery(:term)) * 1.5 +
                    ts_rank_cd(to_tsvector(${minIfGrouped("si.description")}), to_tsquery(:term)) * 1)
                            `, "score")
                .andWhere(new typeorm_1.Brackets((qb1) => {
                qb1
                    .where("to_tsvector(si.sku) @@ to_tsquery(:term)")
                    .orWhere("to_tsvector(si.productName) @@ to_tsquery(:term)")
                    .orWhere("to_tsvector(si.productVariantName) @@ to_tsquery(:term)")
                    .orWhere("to_tsvector(si.description) @@ to_tsquery(:term)");
            }))
                .setParameters({ term: termLogicalAnd });
        }
        if (input.inStock != null) {
            if (input.groupByProduct) {
                qb.andWhere("si.productInStock = :inStock", { inStock: input.inStock });
            }
            else {
                qb.andWhere("si.inStock = :inStock", { inStock: input.inStock });
            }
        }
        if (facetValueIds === null || facetValueIds === void 0 ? void 0 : facetValueIds.length) {
            qb.andWhere(new typeorm_1.Brackets((qb1) => {
                for (const id of facetValueIds) {
                    const placeholder = (0, search_strategy_utils_1.createPlaceholderFromId)(id);
                    const clause = `:${placeholder}::varchar = ANY (string_to_array(si.facetValueIds, ','))`;
                    const params = { [placeholder]: id };
                    if (facetValueOperator === generated_types_1.LogicalOperator.AND) {
                        qb1.andWhere(clause, params);
                    }
                    else {
                        qb1.orWhere(clause, params);
                    }
                }
            }));
        }
        if (facetValueFilters === null || facetValueFilters === void 0 ? void 0 : facetValueFilters.length) {
            qb.andWhere(new typeorm_1.Brackets((qb1) => {
                for (const facetValueFilter of facetValueFilters) {
                    qb1.andWhere(new typeorm_1.Brackets((qb2) => {
                        var _a, _b;
                        if (facetValueFilter.and && ((_a = facetValueFilter.or) === null || _a === void 0 ? void 0 : _a.length)) {
                            throw new core_1.UserInputError("error.facetfilterinput-invalid-input");
                        }
                        if (facetValueFilter.and) {
                            const placeholder = (0, search_strategy_utils_1.createPlaceholderFromId)(facetValueFilter.and);
                            const clause = `:${placeholder}::varchar = ANY (string_to_array(si.facetValueIds, ','))`;
                            const params = { [placeholder]: facetValueFilter.and };
                            qb2.where(clause, params);
                        }
                        if ((_b = facetValueFilter.or) === null || _b === void 0 ? void 0 : _b.length) {
                            for (const id of facetValueFilter.or) {
                                const placeholder = (0, search_strategy_utils_1.createPlaceholderFromId)(id);
                                const clause = `:${placeholder}::varchar = ANY (string_to_array(si.facetValueIds, ','))`;
                                const params = { [placeholder]: id };
                                qb2.orWhere(clause, params);
                            }
                        }
                    }));
                }
            }));
        }
        if (collectionId) {
            qb.andWhere(":collectionId::varchar = ANY (string_to_array(si.collectionIds, ','))", {
                collectionId,
            });
        }
        if (collectionSlug) {
            qb.andWhere(":collectionSlug::varchar = ANY (string_to_array(si.collectionSlugs, ','))", {
                collectionSlug,
            });
        }
        qb.andWhere("si.channelId = :channelId", { channelId: ctx.channelId });
        (0, search_strategy_utils_1.applyLanguageConstraints)(qb, ctx.languageCode, ctx.channel.defaultLanguageCode);
        if (input.groupByProduct === true) {
            qb.groupBy("si.productId");
        }
        return qb;
    }
    createPostgresSelect(groupByProduct) {
        return (0, search_strategy_common_1.getFieldsToSelect)(this.options.indexStockStatus)
            .map((col) => {
            const qualifiedName = `si.${col}`;
            const alias = `si_${col}`;
            if (groupByProduct && col !== "productId") {
                if (col === "facetIds" ||
                    col === "facetValueIds" ||
                    col === "collectionIds" ||
                    col === "channelIds") {
                    return `string_agg(${qualifiedName}, ',') as "${alias}"`;
                }
                if (col === "enabled" ||
                    col === "inStock" ||
                    col === "productInStock") {
                    return `bool_or(${qualifiedName}) as "${alias}"`;
                }
                return `MIN(${qualifiedName}) as "${alias}"`;
            }
            return `${qualifiedName} as "${alias}"`;
        })
            .join(", ");
    }
}
exports.CatalogPostgresSearchStrategy = CatalogPostgresSearchStrategy;
