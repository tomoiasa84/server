require("dotenv").config();

const admin = require("firebase-admin");
const serviceAccount = require("./db/adminkey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hello-world-997df.firebaseio.com"
});

const { PubSub, ApolloServer, gql } = require("apollo-server");
const knex = require("./db/pgAdaptop");
const knexModule = require("./db/knexModule");
console.log(knexModule);

// The GraphQL schema
const typeDefs = require("./schema");

// A map of functions which return data for the schema.
const resolvers = require("./resolvers");
const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const idToken = token.replace("Bearer ", "");
    //console.log(knexModule);
    return {
      admin,
      idToken,
      pubsub,
      knex,
      knexModule
    };
  },
  debug: false
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
