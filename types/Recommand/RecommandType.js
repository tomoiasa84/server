const { gql } = require('apollo-server');
const recommand = gql`

type Recommand {
    id: Int!
    card: Card
    userAsk: User
    recommander: User
    recommanded: User
    flag: Boolean
  }`;

module.exports = recommand;