const { gql } = require("apollo-server");
const query = gql`
  type Query {
    "Query type"
    get_users: [User]
    get_user(userId: Int!): User

    get_locations: [Location]
    get_location(locationId: Int!): Location

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

    get_recommandations: [Recommand]
    get_recommandation(recommandationId: Int!): Recommand

    get_userTags: [UserTag]
    get_userTag(userTagId: Int!): UserTag
  }

  type Mutation {
    create_sharecard(cardId: Int!, userIds: [Int]): [Int]
    delete_sharecard(sharecardId: Int!): Int!

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
      userAsk: Int!
      userSend: Int!
      userRec: Int!
    ): Recommand
    update_recommand(
      recommandId: Int!
      cardId: Int
      userAsk: Int
      userSend: Int
      userRec: Int
    ): Recommand
    delete_recommand(recommandId: Int!): Int!

    create_location(city: String!): Location
    update_location(locationId: Int!, city: String!): Location
    delete_location(locationId: Int!): Int!

    delete_review(reviewId: Int!): Int!
    update_review(reviewId: Int!, stars: Int, text: String): Review
    create_review(
      userId: Int!
      tagReview: Int!
      stars: Int!
      text: String
    ): Review

    create_userTag(userId: Int!, tagId: Int!): UserTag
    update_userTag(usertagId: Int!, defaultFlag: Boolean): UserTag
    delete_userTag(usertagId: Int!): Int!

    delete_tag(tagId: Int!): Int!
    update_tag(tagId: Int!, name: String!): Tag
    create_tag(name: String!): Tag

    create_card(postedBy: Int!, searchFor: Int!, text: String): Card
    update_card(cardId: Int!, tag: Int, message: String): Card
    delete_card(cardId: Int!): Int!

    delete_user(userId: Int!): Int!
    create_user(name: String!, location: Int!, phoneNumber: String!): User
    update_user(userId: Int!, name: String, location: Int, phone: String): User

    delete_connection(connectionId: Int!): Response
    update_connection(connectionId: Int!, confirmation: Boolean!): Response
    create_connection(origin: Int!, target: Int!): Response
  }

  type Subscription {
    cardUpdateSub(userId: Int!): Card!
  }
`;

module.exports = query;
