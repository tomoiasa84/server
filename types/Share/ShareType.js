const { gql } = require("apollo-server");
const share = gql`
  type Share {
    id: Int!
    card: Card
    sharedBy: User
    sharedTo: User
  }
`;
module.exports = share;
