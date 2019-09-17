const { gql } = require("apollo-server");
const user = gql`
  type User {
    id: String!
    firebaseId: String!
    name: String
    location: Location
    phoneNumber: String
    isActive: Boolean
    conversations: [Conversation]
    connections: [User]
    cards: [Card]
    tags: [Tag]
    cards_feed: [Card]
    settings: [Setting]
  }
`;

module.exports = user;
