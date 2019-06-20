const { gql } = require('apollo-server');
const card = gql`

type Card {
    id: Int!
    postedBy: User
    searchFor: Tag
    created_at: String
    message: String
  }`

module.exports = card;