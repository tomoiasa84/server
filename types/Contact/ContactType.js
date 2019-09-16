const { gql } = require("apollo-server");
const contact = gql`
  type Contact {
    number: String!
    exists: Boolean!
  }
`;
module.exports = contact;
