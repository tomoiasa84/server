const { gql } = require('apollo-server');
const privacy = gql`

type Privacy {

    id: String!
    setting: String
  }`

module.exports = privacy;