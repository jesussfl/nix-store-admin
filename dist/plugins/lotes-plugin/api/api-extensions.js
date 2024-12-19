"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminApiExtensions = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.adminApiExtensions = (0, graphql_tag_1.default) `
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
  }
  extend type Mutation {
    createLote(input: CreateLoteInput!): Lote!
    updateLote(loteId: ID!, input: UpdateLoteInput!): Lote!
    deleteLote(loteId: ID!): Boolean!
  }
`;
