const { gql } = require("apollo-server");

module.exports = {
  create_connection: gql`
    mutation create_connection($origin: Int!, $target: Int!) {
      create_connection(origin: $origin, target: $target)
    }
  `,
  delete_connection: gql`
    mutation delete_connection($connId: Int!) {
      delete_connection(connectionId: $connId)
    }
  `,
  get_user: gql`
    query get_user($userId: Int!) {
      get_user(userId: $userId) {
        id
        cards_feed {
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
        cards {
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
    }
  `
};
