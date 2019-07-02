const { PubSub, ApolloServer, gql } = require("apollo-server");
const knex = require("./db/pgAdaptop");
// The GraphQL schema
const typeDefs = require("./schema");

// A map of functions which return data for the schema.
const resolvers = require("./resolvers");
const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    pubsub,
    knex
  },
  playground: true,
  introspection: true
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
