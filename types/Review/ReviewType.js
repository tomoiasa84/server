const { gql } = require('apollo-server');
const review = gql`

type Review {
    "Type of user with id, name"
    id: String!
    recommendationBy: User!
    recommendationFor: Tag!
    stars: String!
    text: String
  }`

module.exports = review;