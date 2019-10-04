const { gql } = require("apollo-server");
const query = gql`
  type Query {
    "Query type"
    get_users: [User]
    get_user(userId: String!): User

    get_locations: [Location]
    get_location(locationId: Int!): Location

    get_shares: [Share]
    get_share(shareId: Int!): Share

    get_settings: [Setting]

    get_cards: [Card]
    get_card(cardId: Int!): Card

    get_tags: [Tag]
    get_tag(tagId: Int!): Tag

    get_reviews: [Review]
    get_review(reviewId: Int!): Review

    get_userTags: [UserTag]
    get_userTag(userTagId: Int!): UserTag

    get_recommands: [Recommand]
    get_recommand(recommandId: Int!): [Recommand]

    get_conversations: [Conversation]
    get_conversation(conversationId: String!): Conversation

    check_contacts(contactsList: [String]!): [Contact]
  }

  type Mutation {
    delete_conversation(conversationId: String!): String!
    create_conversation(user1: String!, user2: String!): Conversation
    update_conversation(
      conversationId: String!
      user1: String
      user2: String
    ): Conversation

    create_share(cardId: Int!, sharedBy: String!, sharedTo: String!): Share
    delete_share(shareId: Int!): Int!

    create_recommand(
      cardId: Int!
      userAskId: String!
      userSendId: String!
      userRecId: String!
    ): Recommand
    update_recommand(
      recommandId: Int!
      userRecId: String!
      accepted: Boolean
    ): Recommand
    delete_recommand(recommandId: Int!): Int!

    create_location(city: String!): Location
    update_location(locationId: Int!, city: String!): Location
    delete_location(locationId: Int!): Int!

    delete_review(reviewId: Int!): Int!
    update_review(reviewId: Int!, stars: Int, text: String): Review
    create_review(
      userId: String!
      userTagId: Int!
      stars: Int!
      text: String
    ): Review

    create_userTag(userId: String!, tagId: Int!): UserTag
    update_userTag(userTagId: Int!): UserTag
    delete_userTag(userTagId: Int!): Int!

    delete_tag(tagId: Int!): Int!
    update_tag(tagId: Int!, name: String!): Tag
    create_tag(name: String!): Tag

    create_card(postedBy: String!, searchFor: Int!, text: String): Card
    update_card(cardId: Int!, tag: Int, message: String): Card
    delete_card(cardId: Int!): Int!

    load_contacts(phoneContacts: [String]): [User]
    delete_user(userId: String!): String!
    create_user(
      firebaseId: String!
      name: String!
      location: Int!
      phoneNumber: String!
    ): User
    update_user(
      userId: String!
      name: String
      location: Int
      profileURL: String
      phoneNumber: String
      description: String
      isActive: Boolean
    ): User

    delete_connection(connectionId: Int!): Connection
    #update_connection(connectionId: String!, confirmation: Boolean!): Int
    create_connection(origin: String!, target: String!): Connection
  }

  type Subscription {
    cardUpdateSub(userId: String!): Card!
  }
`;

module.exports = query;
