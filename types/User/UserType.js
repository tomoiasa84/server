const { gql } = require('apollo-server');
const user = gql`

type User {
    "Type of user with id, name"
    id: Int!
    name: String
    location: Location
    phoneNumber: String
    isActive: Boolean
    settings: [Setting]
    
    
    connections: [User]
    cards: [Card]
    tags: [Tag]
    thread_messages: [ThreadMessage]
    cards_feed:[Card]
  }`

module.exports = user;