"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopApiExtensions = exports.adminApiExtensions = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.adminApiExtensions = (0, graphql_tag_1.default) `
  type StorefrontNews implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String!
    summary: String!
    imageAsset: Asset
    ctaText: String
    ctaLink: String
    sortOrder: Int!
    isPublished: Boolean!
  }

  type StorefrontNewsList implements PaginatedList {
    items: [StorefrontNews!]!
    totalItems: Int!
  }

  input CreateStorefrontNewsInput {
    title: String!
    summary: String!
    imageAssetId: ID
    ctaText: String
    ctaLink: String
    sortOrder: Int
    isPublished: Boolean
  }

  input UpdateStorefrontNewsInput {
    title: String!
    summary: String!
    imageAssetId: ID
    ctaText: String
    ctaLink: String
    sortOrder: Int
    isPublished: Boolean
  }

  input StorefrontNewsFilterParameter {
    title: StringOperators
    summary: StringOperators
    ctaText: StringOperators
    ctaLink: StringOperators
    sortOrder: NumberOperators
    isPublished: BooleanOperators
  }

  input StorefrontNewsSortParameter {
    id: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    title: SortOrder
    sortOrder: SortOrder
    isPublished: SortOrder
  }

  input StorefrontNewsListOptions {
    skip: Int
    take: Int
    sort: StorefrontNewsSortParameter
    filter: StorefrontNewsFilterParameter
  }

  extend type Query {
    storefrontNewsItems(options: StorefrontNewsListOptions): StorefrontNewsList!
    getStorefrontNewsItem(newsId: ID!): StorefrontNews
  }

  extend type Mutation {
    createStorefrontNewsItem(input: CreateStorefrontNewsInput!): StorefrontNews!
    updateStorefrontNewsItem(newsId: ID!, input: UpdateStorefrontNewsInput!): StorefrontNews!
    deleteStorefrontNewsItem(newsId: ID!): Boolean!
  }
`;
exports.shopApiExtensions = (0, graphql_tag_1.default) `
  type StorefrontNews implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String!
    summary: String!
    imageAsset: Asset
    ctaText: String
    ctaLink: String
    sortOrder: Int!
    isPublished: Boolean!
  }

  extend type Query {
    storefrontNews: [StorefrontNews!]!
  }
`;
