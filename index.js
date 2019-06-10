const { ApolloServer, gql } = require('apollo-server');

// The GraphQL schema
const typeDefs = require('./schema');

// A map of functions which return data for the schema.
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  });