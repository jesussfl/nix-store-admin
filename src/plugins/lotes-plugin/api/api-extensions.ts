import gql from "graphql-tag";

export const adminApiExtensions = gql`
  type Lote implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    description: String
  }
  type LoteList implements PaginatedList {
    items: [Lote!]!
    totalItems: Int!
  }

  input CreateLoteInput {
    name: String!
    description: String
  }

  input UpdateLoteInput {
    name: String!
    description: String
  }

  input LoteListOptions

  extend type Query {
    allLotes(options: LoteListOptions): LoteList!
    getLote(loteId: ID!): Lote
  }
  extend type Mutation {
    createLote(input: CreateLoteInput!): Lote!
    updateLote(loteId: ID!, input: UpdateLoteInput!): Lote!
    deleteLote(loteId: ID!): Boolean!
  }
  extend type Order {
    lote: Lote
  }
`;

export const apiExtensions = gql`
  type Lote implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    description: String!
  }
`;
