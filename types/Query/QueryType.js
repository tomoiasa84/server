const { gql } = require('apollo-server');
const query = gql`

type Query {
    "Query type"
    hello: String
    users: [User]
    locations: [Location]
  }`

module.exports = query;