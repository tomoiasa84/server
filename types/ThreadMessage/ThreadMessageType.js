const { gql } = require("apollo-server");
const threadMessage = gql`
  type ThreadMessage {
    id: Int!
    users: [User]
    messages: [Message]
    recommandCard: Recommand
  }
`;

module.exports = threadMessage;
