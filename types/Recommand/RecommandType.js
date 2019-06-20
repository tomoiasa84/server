const { gql } = require('apollo-server');
const recommand = gql`

type Recommand {
    id: Int!
    name: String
  }`;

module.exports = recommand;