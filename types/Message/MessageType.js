const { gql } = require('apollo-server');
const message = gql`

type Message {
    
    id: Int!
    text: String!
    messageThread: Int!
    messageFrom: User!
  }`

module.exports = message;