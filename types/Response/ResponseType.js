const { gql } = require('apollo-server');
const response = gql`

type Response {

    status: String!
  }`

module.exports = response;