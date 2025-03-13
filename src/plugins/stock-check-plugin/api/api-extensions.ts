import gql from "graphql-tag";

export const shopApiExtensions = gql`
  extend type Query {
    """
    Get the current stock level for a product variant
    """
    currentStockLevel(variantId: ID!): Int
  }
`;
