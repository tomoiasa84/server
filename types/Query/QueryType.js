const { gql } = require('apollo-server');
const query = gql`

type Query {
  "Query type"
  users: [User]
  locations: [Location]
  privacies: [Privacy]
}

type Mutation{

  createConnection(id1:String!,id2:String!): Response
}
`

module.exports = query;