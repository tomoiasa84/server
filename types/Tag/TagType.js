const { gql } = require("apollo-server");
const tag = gql`
  type Tag {
    id: Int!
    name: String
  }
`;

module.exports = tag;
