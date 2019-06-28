const { gql } = require('apollo-server');
const setting = gql`

type Setting {

    id: Int!
    name: String
    value: String
  }`

module.exports = setting;