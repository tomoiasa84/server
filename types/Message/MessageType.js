const { gql } = require('apollo-server');
const message = gql`

type Message {
    
    id: Int!
    text: String!
    messageThread: ThreadMessage!
    messageFrom: User!
  }`

module.exports = message;