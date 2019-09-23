const { gql } = require("apollo-server");
const user = gql`
  type User {
    id: String!
    firebaseId: String!
    name: String
    location: Location
    description: String
    phoneNumber: String
    isActive: Boolean
    conversations: [Conversation]
    connections: [User]
    cards: [Card]
    tags: [UserTag]
    cards_feed: [Card]
    reviews: [Review]
    settings: [Setting]
  }
`;

module.exports = user;
