const { gql } = require('apollo-server');
const review = gql`

type Review {
    "Type of user with id, name"
    id: Int!
    recommendationBy: User!
    recommendationFor: Tag!
    stars: Int!
    text: String
  }`

module.exports = review;