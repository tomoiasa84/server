const { gql } = require("apollo-server");
const user = gql`
  type User {
    id: String!
    firebaseId: String!
    name: String
    location: Location
    profileURL: String
    description: String
    phoneNumber: String
    deviceToken: String
    isActive: Boolean
    conversations: [Conversation]
    connections: [Connection]
    cardsConnections: [Card]
    cards: [Card]
    tags: [UserTag]
    reviews: [Review]
    settings: [Setting]
  }
`;

module.exports = user;
