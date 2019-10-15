require("dotenv").config(); //deployment enviroment
const { PubSub, ApolloServer, gql } = require("apollo-server");

//Firebase modules
const admin = require("firebase-admin");

const verifyToken = require("./verifyToken");

//Tools for application
const { parsePhoneNumberFromString } = require("libphonenumber-js");
const fetch = require("node-fetch");
const uuidv1 = require("uuid/v1");
var log4js = require("log4js");
log4js.configure({
  appenders: { out: { type: "stdout" } },
  categories: { default: { appenders: ["out"], level: "trace" } }
});
const logger = log4js.getLogger("out");

//Database modules
const knexModule = require("./db/knexModule");
//Apollo and Graphql frameworks
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

//setting up enviroment
if (process.env.NODE_ENV === "dev") {
  console.log("Hello from dev");
  const serviceAccount = require("./db/hello-world-key");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hello-world-997df.firebaseio.com"
  });
  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        phoneFormater: parsePhoneNumberFromString,
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
  const serviceAccount = require("./db/adminkey");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://contractorsearch-eeaf7.firebaseio.com"
  });
  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const tokenId = token.replace("Bearer ", "");
      return {
        phoneFormater: parsePhoneNumberFromString,
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
  const serviceAccount = require("./db/adminkey");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://contractorsearch-eeaf7.firebaseio.com"
  });
  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const tokenId = token.replace("Bearer ", "");
      return {
        phoneFormater: parsePhoneNumberFromString,
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
