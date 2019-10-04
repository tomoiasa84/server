const { gql } = require("apollo-server");
const connection = gql`
  type Connection {
    id: Int!
    originUser: User
    targetUser: User
  }
`;
module.exports = connection;
