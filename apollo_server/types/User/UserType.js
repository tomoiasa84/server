const { gql } = require('apollo-server');
const user = gql`

type User {
    "Type of user with id, name"
    id: String!
    name: String
  }`

module.exports = user;