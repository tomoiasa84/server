const { gql } = require("apollo-server");
const userTag = gql`
  type UserTag {
    id: Int!
    user: User
    tag: Tag
    default: Boolean
  }
`;

module.exports = userTag;
