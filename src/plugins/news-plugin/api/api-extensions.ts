import gql from "graphql-tag";

export const adminApiExtensions = gql`
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

export const shopApiExtensions = gql`
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
