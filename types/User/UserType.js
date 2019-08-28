const { gql } = require("apollo-server");
const user = gql`
  type User {
    id: String!
    name: String
    location: Location
    phoneNumber: String
    isActive: Boolean
    connections: [User]
    cards: [Card]
    tags: [Tag]
    thread_messages: [ThreadMessage]
    cards_feed: [Card]
    settings: [Setting]
  }
`;

module.exports = user;
