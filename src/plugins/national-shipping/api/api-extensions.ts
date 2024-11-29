import gql from "graphql-tag";

export const nationalShippingExtension = gql`
  type CustomAddress {
    id: ID!
    firstName: String!
    lastName: String!
    streetLine1: String!
    streetLine2: String
    city: String!
    province: String!
    postalCode: String!
    country: CountryCode!
    phoneNumber: String
    metadata: JSON
  }

  extend type Mutation {
    setOrderShippingAddress(input: CustomAddress!): Order
  }
`;
