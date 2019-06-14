const { gql } = require('apollo-server');
const tag = gql`

type Tag {
    id: String!
    name: String
  }`

module.exports = tag;