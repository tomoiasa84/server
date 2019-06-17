const { gql } = require('apollo-server');
const user = gql`

type User {
    "Type of user with id, name"
    id: String!
    name: String
    location: Location
    phone: String
    hasAccount: Boolean
    privacy: Privacy
    connections: [User]
    cards: [Card]
    tags: [Tag]
  }`

module.exports = user;