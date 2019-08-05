const { gql } = require("apollo-server");

module.exports = {
  create_recommand: gql`
    mutation create_recommand(
      $cardId: Int!
      $userAsk: Int!
      $userSend: Int!
      $userRec: Int!
    ) {
      create_recommand(
        cardId: $cardId
        userAsk: $userAsk
        userSend: $userSend
        userRec: $userRec
      ) {
        id
        card {
          id
          postedBy {
            id
            name
            phoneNumber
            isActive
            cards_feed {
              id
              createdAt
              text
              postedBy {
                id
                name
              }
              searchFor {
                id
                name
              }
            }
            tags {
              id
              name
            }
            connections {
              id
              name
            }
            location {
              id
              city
            }
            settings {
              id
              name
              value
            }
          }
          searchFor {
            id
            name
          }
          createdAt
          text
        }
        userAsk {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
        userSend {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
        userRecommand {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
      }
    }
  `,
  update_recommand: gql`
    mutation update_recommand(
      $recommandId: Int!
      $cardId: Int!
      $userAsk: Int!
      $userSend: Int!
      $userRec: Int!
    ) {
      update_recommand(
        recommandId: $recommandId
        cardId: $cardId
        userAsk: $userAsk
        userSend: $userSend
        userRec: $userRec
      ) {
        id
        card {
          id
          postedBy {
            id
            name
            phoneNumber
            isActive
            cards_feed {
              id
              createdAt
              text
              postedBy {
                id
                name
              }
              searchFor {
                id
                name
              }
            }
            tags {
              id
              name
            }
            connections {
              id
              name
            }
            location {
              id
              city
            }
            settings {
              id
              name
              value
            }
          }
          searchFor {
            id
            name
          }
          createdAt
          text
        }
        userAsk {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
        userSend {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
        userRecommand {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
      }
    }
  `,
  delete_recommand: gql`
    mutation delete_recommand($recommandId: Int!) {
      delete_recommand(recommandId: $recommandId)
    }
  `,
  get_recommands: gql`
    query get_recommands {
      get_recommands {
        id
        card {
          id
          postedBy {
            id
            name
            phoneNumber
            isActive
            cards_feed {
              id
              createdAt
              text
              postedBy {
                id
                name
              }
              searchFor {
                id
                name
              }
            }
            tags {
              id
              name
            }
            connections {
              id
              name
            }
            location {
              id
              city
            }
            settings {
              id
              name
              value
            }
          }
          searchFor {
            id
            name
          }
          createdAt
          text
        }
        userAsk {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
        userSend {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
        userRecommand {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
      }
    }
  `,
  get_recommand: gql`
    query get_recommand($recommandId: Int!) {
      get_recommand(recommandId: $recommandId) {
        id
        card {
          id
          postedBy {
            id
            name
            phoneNumber
            isActive
            cards_feed {
              id
              createdAt
              text
              postedBy {
                id
                name
              }
              searchFor {
                id
                name
              }
            }
            tags {
              id
              name
            }
            connections {
              id
              name
            }
            location {
              id
              city
            }
            settings {
              id
              name
              value
            }
          }
          searchFor {
            id
            name
          }
          createdAt
          text
        }
        userAsk {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
        userSend {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
        userRecommand {
          id
          name
          phoneNumber
          isActive
          cards_feed {
            id
            createdAt
            text
            postedBy {
              id
              name
            }
            searchFor {
              id
              name
            }
          }
          tags {
            id
            name
          }
          connections {
            id
            name
          }
          location {
            id
            city
          }
          settings {
            id
            name
            value
          }
        }
      }
    }
  `
};
