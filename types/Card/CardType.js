const { gql } = require('apollo-server');
const card = gql`

type Card {
    id: String!
    postedBy: User
    searchFor: Tag
    created_at: String
    message: String
  }`

module.exports = card;