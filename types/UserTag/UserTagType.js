const { gql } = require("apollo-server");
const userTag = gql`
  type UserTag {
    id: Int!
    user: User
    tag: Tag
    reviews: [Review]
    score: Int
    default: Boolean
  }
`;
module.exports = userTag;
