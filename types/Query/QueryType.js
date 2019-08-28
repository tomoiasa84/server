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

    get_messages: [Message]
    get_message(msgId: Int!): Message

    get_threadmessages: [ThreadMessage]
    get_threadmessage(messageThreadId: Int!): ThreadMessage

    get_recommands: [Recommand]
    get_recommand(recommandId: Int!): Recommand

    get_userTags: [UserTag]
    get_userTag(userTagId: Int!): UserTag
  }

  type Mutation {
    create_share(cardId: Int!, sharedBy: String!, sharedTo: [String]): [Int]
    delete_share(shareIds: [Int]!): [Int]!

    create_threadmessage(
      userRecomCard: Int
      originUserId: Int!
      targetUserId: Int!
    ): ThreadMessage
    update_threadmessage(
      threadMessageId: Int!
      userRecomCard: Int!
    ): ThreadMessage
    delete_threadmessage(threadMessageId: Int!): Int!

    create_message(text: String!, msgThread: Int!, msgFrom: Int!): Message
    update_message(
      messageId: Int!
      text: String
      msgThread: Int
      msgFrom: Int
    ): Message
    delete_message(messageId: Int!): Int!

    create_recommand(
      cardId: Int!
      userAsk: String!
      userSend: String!
      userRec: String!
    ): Recommand
    update_recommand(
      recommandId: Int!
      cardId: Int
      userAsk: String
      userSend: String
      userRec: String
    ): Recommand
    delete_recommand(recommandId: Int!): Int!

    create_location(city: String!): Location
    update_location(locationId: Int!, city: String!): Location
    delete_location(locationId: Int!): Int!

    delete_review(reviewId: Int!): Int!
    update_review(reviewId: Int!, stars: Int, text: String): Review
    create_review(
      userId: String!
      tagReview: Int!
      stars: Int!
      text: String
    ): Review

    create_userTag(userId: String!, tagId: Int!): UserTag
    update_userTag(userTagId: Int!, defaultFlag: Boolean): UserTag
    delete_userTag(userTagId: Int!): Int!

    delete_tag(tagId: Int!): Int!
    update_tag(tagId: Int!, name: String!): Tag
    create_tag(name: String!): Tag

    create_card(postedBy: Int!, searchFor: Int!, text: String): Card
    update_card(cardId: Int!, tag: Int, message: String): Card
    delete_card(cardId: Int!): Int!

    delete_user(userId: String!): String!
    create_user(
      id: String!
      name: String!
      location: Int!
      phoneNumber: String!
    ): User
    update_user(
      userId: String!
      name: String
      location: Int
      phoneNumber: String
    ): User

    delete_connection(connectionId: String!): Int
    update_connection(connectionId: String!, confirmation: Boolean!): Int
    create_connection(origin: String!, target: String!): Int
  }

  type Subscription {
    cardUpdateSub(userId: String!): Card!
  }
`;

module.exports = query;
