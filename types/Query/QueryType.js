const { gql } = require('apollo-server');
const query = gql`

type Query {
  "Query type"
  get_users: [User]
  get_user(id:String!):User
  locations: [Location]
  privacies: [Privacy]
  get_cards: [Card]
  get_card(cardId:String!): Card
  tags: [Tag]
}

type Mutation{

  create_card(postedBy:String!,searchFor:String!,message:String):Response
  delete_user(userId:String!):Response
  create_user(name:String!,cityName:String!,phone:String!):Response
  accept_connection(idUser:String!):Response
  refuse_connection(idUser:String!):Response
  create_connection(id1:String!,id2:String!): Response
  update_user(id:String!,name:String,location:String,phone:String):Response
}
`

module.exports = query;