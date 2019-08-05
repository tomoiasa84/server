const { gql } = require("apollo-server");

module.exports = {
  create_share: gql`
    mutation create_share($cardId: Int!, $sharedBy: Int!, $sharedTo: [Int]) {
      create_share(cardId: $cardId, sharedBy: $sharedBy, sharedTo: $sharedTo)
    }
  `,
  delete_share: gql`
    mutation delete_share($shareIds: [Int]!) {
      delete_share(shareIds: $shareIds)
    }
  `,
  get_shares: gql`
    query get_shares {
      get_shares {
        id
        card {
          id
          postedBy {
            id
            name
          }
          searchFor {
            id
            name
          }
          createdAt
          text
        }
      }
    }
  `,
  get_share: gql`
    query get_share($sharId: Int!) {
      get_shares(shareId: $sharId) {
        id
        card {
          id
          postedBy {
            id
            name
          }
          searchFor {
            id
            name
          }
          createdAt
          text
        }
      }
    }
  `
};
