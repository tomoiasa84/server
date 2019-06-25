const { gql } = require('apollo-server');
const query = gql`

type Query {
  "Query type"
  get_users: [User]
  get_user(userId:Int!):User

  get_locations: [Location]
  get_location(locationId:Int!):Location

  privacies: [Privacy]

  get_cards: [Card]
  get_card(cardId:Int!): Card

  get_tags: [Tag]
  get_tag(tagId:Int!): Tag

  get_reviews:[Review]
  get_review(reviewId:Int!):Review

  get_messages:[Message]
  get_message(msgId:Int!):Message

  get_threadmessages:[ThreadMessage]
  get_threadmessage:ThreadMessage

  get_recommandations:[Recommand]
  
  get_userTags:[UserTag]
  get_userTag(userTagId:Int!):UserTag
}

type Mutation{

  share_card(cardId:Int!,userIds:[Int]):[Int]
  create_threadmessage(userRecomCard:Int,
            originUserId:Int!,
            targetUserId:Int!):[Int!]!
  create_message(text:String!,
            msgThread:Int!,
            msgFrom:Int!):Message
  recommend_card(cardId:Int!,
            userAsk:Int!,
            userSend:Int!,
            userRec:Int!):Recommand
  add_location(city:String!):Response
  edit_review(reviewId:Int!,
            stars:Int,
            text:String):Response

  add_review(userId:Int!,
            tagReview:Int!,
            stars:Int!,
            text:String!):Response

  default_tag(usertagId:Int!):Response
  remove_usertag(usertagId:Int!):Response
  add_usertag(userId:Int!,tagId:Int!):User

  creat_userTag(userId:Int!,tagId:Int!):UserTag
  update_userTag(usertagId:Int!,defaultFlag:Boolean):UserTag
  delete_userTag(usertagId:Int!):Int!

  delete_tag(tagId:Int!):Int!
  create_tag(name:String!):Tag

  create_card(postedBy:Int!,searchFor:Int!,message:String):Card
  update_card(cardId:Int!,tag:Int,message:String):Card
  delete_card(cardId:Int!):Int!

  delete_user(userId:Int!):Int!
  create_user(name:String!,cityId:Int!,phone:String!):User
  update_user(userId:Int!,name:String,location:Int,phone:String):User

  accept_connection(idUser:Int!):Response
  refuse_connection(idUser:Int!):Response
  create_connection(id1:Int!,id2:Int!): Response
}

type Subscription{

  cardUpdateSub(userId:Int!): Card!
}
`

module.exports = query;