/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  fragment LoteDetail on Lote {\n    id\n    createdAt\n    updatedAt\n    name\n    description\n  }\n": types.LoteDetailFragmentDoc,
    "\n  query GetLote($id: ID!) {\n    getLote(loteId: $id) {\n      ...LoteDetail\n    }\n  }\n": types.GetLoteDocument,
    "\n  mutation CreateLote($input: CreateLoteInput!) {\n    createLote(input: $input) {\n      ...LoteDetail\n    }\n  }\n": types.CreateLoteDocument,
    "\n  mutation UpdateLote($id: ID!, $input: UpdateLoteInput!) {\n    updateLote(loteId: $id, input: $input) {\n      ...LoteDetail\n    }\n  }\n": types.UpdateLoteDocument,
    "\n  mutation DeleteLote($id: ID!) {\n    deleteLote(loteId: $id)\n  }\n": types.DeleteLoteDocument,
    "\n  query AllLotes($options: LoteListOptions) {\n    allLotes(options: $options) {\n      items {\n        id\n        createdAt\n        updatedAt\n        name\n        description\n      }\n      totalItems\n    }\n  }\n": types.AllLotesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment LoteDetail on Lote {\n    id\n    createdAt\n    updatedAt\n    name\n    description\n  }\n"): (typeof documents)["\n  fragment LoteDetail on Lote {\n    id\n    createdAt\n    updatedAt\n    name\n    description\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLote($id: ID!) {\n    getLote(loteId: $id) {\n      ...LoteDetail\n    }\n  }\n"): (typeof documents)["\n  query GetLote($id: ID!) {\n    getLote(loteId: $id) {\n      ...LoteDetail\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLote($input: CreateLoteInput!) {\n    createLote(input: $input) {\n      ...LoteDetail\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLote($input: CreateLoteInput!) {\n    createLote(input: $input) {\n      ...LoteDetail\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateLote($id: ID!, $input: UpdateLoteInput!) {\n    updateLote(loteId: $id, input: $input) {\n      ...LoteDetail\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateLote($id: ID!, $input: UpdateLoteInput!) {\n    updateLote(loteId: $id, input: $input) {\n      ...LoteDetail\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteLote($id: ID!) {\n    deleteLote(loteId: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteLote($id: ID!) {\n    deleteLote(loteId: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllLotes($options: LoteListOptions) {\n    allLotes(options: $options) {\n      items {\n        id\n        createdAt\n        updatedAt\n        name\n        description\n      }\n      totalItems\n    }\n  }\n"): (typeof documents)["\n  query AllLotes($options: LoteListOptions) {\n    allLotes(options: $options) {\n      items {\n        id\n        createdAt\n        updatedAt\n        name\n        description\n      }\n      totalItems\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;