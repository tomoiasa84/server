const { gql } = require("apollo-server");
const conversation = gql`
  type Conversation {
    id: String!
    user1: User
    user2: User
  }
`;

module.exports = conversation;
