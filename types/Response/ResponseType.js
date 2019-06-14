const { gql } = require('apollo-server');
const response = gql`

type Response {

    status: String!
    message: String!
  }`

module.exports = response;