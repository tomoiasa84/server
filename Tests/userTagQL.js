const { gql } = require("apollo-server");

module.exports = {
  create_userTag: gql`
    mutation create_userTag($userId: Int!, $tagId: Int!) {
      create_userTag(userId: $userId, tagId: $tagId) {
        id
        tag {
          id
          name
        }
        user {
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
  update_userTag: gql`
    mutation update_userTag($userTagId: Int!, $defaultFlag: Boolean!) {
      update_userTag(userTagId: $userTagId, defaultFlag: $defaultFlag) {
        id
        tag {
          id
          name
        }
        user {
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
  delete_userTag: gql`
    mutation delete_userTag($userTagId: Int!) {
      delete_userTag(userTagId: $userTagId)
    }
  `,
  get_userTags: gql`
    query get_userTags {
      get_userTags {
        id
        tag {
          id
          name
        }
        user {
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
  get_userTag: gql`
    query get_userTag($userTagId: Int!) {
      get_userTag(userTagId: $userTagId) {
        id
        tag {
          id
          name
        }
        user {
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
