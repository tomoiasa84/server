const { gql } = require("apollo-server");
const card = gql`
  type Card {
    id: Int!
    postedBy: User
    searchFor: Tag
    createdAt: String
    text: String
    recommandsCount: Int
    recommandsList: [Recommand]
  }
`;

module.exports = card;
