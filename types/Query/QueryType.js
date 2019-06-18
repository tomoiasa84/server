const { gql } = require('apollo-server');
const query = gql`

type Query {
  "Query type"
  get_users: [User]
  get_user(userId:String!):User
  locations: [Location]
  privacies: [Privacy]
  get_cards: [Card]
  get_card(cardId:String!): Card
  get_tags: [Tag]
  get_tag(tagId:String!): Tag
  get_reviews:[Review]
  get_review(reviewId:String!):Review
  
}

type Mutation{

  edit_review(reviewId:String!,
            stars:String,
            text:String):Response

  add_review(userId:String!,
            tagReview:String!,
            stars:String!,
            text:String!):Response

  default_tag(usertagId:String!):Response
  remove_usertag(usertagId:String!):Response
  add_usertag(userId:String!,tagId:String!):String

  delete_tag(tagId:String!):Response
  create_tag(name:String!):Tag

  create_card(postedBy:String!,searchFor:String!,message:String):Card
  update_card(cardId:String!,tag:String,message:String):Response
  delete_card(cardId:String!):Response

  delete_user(userId:String!):Response
  create_user(name:String!,cityId:String!,phone:String!):User
  update_user(userId:String!,name:String,location:String,phone:String):Response

  accept_connection(idUser:String!):Response
  refuse_connection(idUser:String!):Response
  create_connection(id1:String!,id2:String!): Response
}
`

module.exports = query;