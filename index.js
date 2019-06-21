const { ApolloServer, gql } = require('apollo-server');
const knex = require('./db/pgAdaptop');
// The GraphQL schema
const typeDefs = require('./schema');

// A map of functions which return data for the schema.
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:{

    knex
  }
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  });