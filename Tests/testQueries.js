const { gql } = require("apollo-server");

module.exports = {
  user: {
    get_users: gql`
      query get_users {
        get_users {
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
    `,
    get_user: gql`
      query get_user($userId: Int!) {
        get_user(userId: $userId) {
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
    `,
    update_user: gql`
      mutation update_user(
        $id: Int!
        $name: String!
        $location: Int!
        $phone: String!
      ) {
        update_user(
          userId: $id
          name: $name
          location: $location
          phoneNumber: $phone
        ) {
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
    `,
    create_user: gql`
      mutation create_user(
        $id: Int!
        $name: String!
        $location: Int!
        $phoneNumber: String!
      ) {
        create_user(
          id: $id
          name: $name
          location: $location
          phoneNumber: $phoneNumber
        ) {
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
    `,
    delete_user: gql`
      mutation delete_user($userId: Int!) {
        delete_user(userId: $userId)
      }
    `
  },
  card: {
    get_cards: gql`
      query get_cards {
        get_cards {
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
      }
    `,
    get_card: gql`
      query get_card($cardId: Int!) {
        get_card(cardId: $cardId) {
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
      }
    `,
    create_card: gql`
      mutation create_card($postedBy: Int!, $searchFor: Int!, $text: String) {
        create_card(postedBy: $postedBy, searchFor: $searchFor, text: $text) {
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
      }
    `,
    update_card: gql`
      mutation update_card($cardId: Int!, $searchFor: Int!, $text: String) {
        update_card(cardId: $cardId, tag: $searchFor, message: $text) {
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
      }
    `,
    delete_card: gql`
      mutation delete_card($cardId: Int!) {
        delete_card(cardId: $cardId)
      }
    `
  }
};
