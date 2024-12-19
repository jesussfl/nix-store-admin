"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialPaymentExtension = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.partialPaymentExtension = (0, graphql_tag_1.default) `
  type MyCustomErrorResult implements ErrorResult {
    errorCode: ErrorCode!
    message: String!
  }
  union MyCustomMutationResult = Order | MyCustomErrorResult

  extend type Mutation {
    addPaymentToExistingOrder(orderCode: String!, paymentMethodCode: String!, metadata: JSON): MyCustomMutationResult
  }
`;
