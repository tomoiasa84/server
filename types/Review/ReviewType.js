const { gql } = require('apollo-server');
const review = gql`

type Review {
    "Type of user with id, name"
    id: Int!
    author: User
    userTag: Tag
    stars: Int
    text: String
  }`

module.exports = review;