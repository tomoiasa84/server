const { gql } = require('apollo-server');
const privacy = gql`

type Privacy {

    id: Int!
    setting: String
  }`

module.exports = privacy;