const { gql } = require("apollo-server");
const connection = gql`
  type Connection {
    id: String!
    originUser: User
    targetUser: User
  }
`;
module.exports = connection;
