require("dotenv").config();//deployment enviroment

//Apollo and Graphql frameworks
const { PubSub, ApolloServer, gql } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

//Firebase modules
const admin = require("firebase-admin");
const serviceAccount = require("./db/adminkey");
const verifyToken = require("./verifyToken");

//Database modules
const knexModule = require("./db/knexModule");


//Tools for application
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const fetch = require("node-fetch");
const uuidv1 = require("uuid/v1");
var log4js = require("log4js");
log4js.configure({
  appenders: { out: { type: "stdout" } },
  categories: { default: { appenders: ["out"], level: "trace" } }
});
const logger = log4js.getLogger("out");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://contractorsearch-eeaf7.firebaseio.com"
});

//setting up enviroment
if (process.env.NODE_ENV === "dev") {
  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        fetch,
        uuidv1,
        logger,
        admin,
        verifyToken,
        tokenId: "WzEu3ImkhhmVH1KtKg4iIZvezEXFQkWA",
        pubsub,
        knexModule
      };
    },
    debug: true
  });

  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
} else if (process.env.NODE_ENV === "test") {
  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const tokenId = token.replace("Bearer ", "");
      return {
        fetch,
        uuidv1,
        admin,
        verifyToken,
        tokenId,
        pubsub,
        knexModule,
        logger
      };
    },
    debug: true
  });

  server
    .listen({ port: process.env.PORT || 4000 })
    .then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    })
    .catch(err => {
      console.log(err);
    });
} else if (process.env.NODE_ENV === "prod") {
  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const tokenId = token.replace("Bearer ", "");
      return {
        fetch,
        admin,
        verifyToken,
        tokenId,
        pubsub,
        knexModule,
        logger
      };
    },
    debug: false
  });

  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}
