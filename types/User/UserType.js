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
    cardsConnections: [Card]
    cards: [Card]
    tags: [UserTag]
    reviews: [Review]
    settings: [Setting]
  }
`;

module.exports = user;
