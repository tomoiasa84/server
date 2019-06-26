const { gql } = require('apollo-server');
const user = gql`

type User {
    "Type of user with id, name"
    id: Int!
    name: String
    location: Location
    phone: String
    hasAccount: Boolean
    privacy: Privacy
    
    connections: [User]
    cards: [Card]
    tags: [Tag]
    thread_messages: [ThreadMessage]
    cards_feed:[Card]
  }`

module.exports = user;