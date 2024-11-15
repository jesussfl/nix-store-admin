import gql from "graphql-tag";

export const partialPaymentExtension = gql`
  type MyCustomErrorResult implements ErrorResult {
    errorCode: ErrorCode!
    message: String!
  }
  union MyCustomMutationResult = Order | MyCustomErrorResult

  extend type Mutation {
    addPaymentToExistingOrder(orderCode: String!, paymentMethodCode: String!, metadata: JSON): MyCustomMutationResult
  }
`;
