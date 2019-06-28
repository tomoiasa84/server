const { gql } = require('apollo-server');
const recommand = gql`

type Recommand {
    id: Int!
    card: Card
    userAsk: User
    userSend: User
    userRecommand: User
    acceptedFlag: Boolean
  }`;

module.exports = recommand;