const { gql } = require('apollo-server');
const location = gql`

type Location {
    id: Int!
    city: String!
  }`

module.exports = location;