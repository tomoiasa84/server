const { PubSub,ApolloServer, gql } = require('apollo-server');

const knex = require('./db/pgAdaptop');
// The GraphQL schema
const typeDefs = require('./schema');

// A map of functions which return data for the schema.
const resolvers = require('./resolvers');
const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:{
    pubsub,
    knex
    
  }
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  });