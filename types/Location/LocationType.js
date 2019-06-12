const { gql } = require('apollo-server');
const location = gql`

type Location {
    id: String!
    city: String
  }`

module.exports = location;