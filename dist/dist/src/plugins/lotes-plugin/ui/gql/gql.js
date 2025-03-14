"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphql = void 0;
/* eslint-disable */
const types = __importStar(require("./graphql"));
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
function graphql(source) {
    var _a;
    return (_a = documents[source]) !== null && _a !== void 0 ? _a : {};
}
exports.graphql = graphql;
