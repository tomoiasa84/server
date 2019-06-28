const { gql } = require('apollo-server');
const card = gql`

type Card {
    id: Int!
    postedBy: User
    searchFor: Tag
    createdAt: String
    text: String
  }`

module.exports = card;