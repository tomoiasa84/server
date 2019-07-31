require("dotenv").config();
const { PubSub, ApolloServer, gql } = require("apollo-server");
const admin = require("firebase-admin");
const serviceAccount = require("./db/adminkey");
const knex = require("./db/pgAdaptop");
const knexModule = require("./db/knexModule");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const verifyToken = require("./verifyToken");
var log4js = require("log4js");
log4js.configure({
  appenders: { out: { type: "stdout" } },
  categories: { default: { appenders: ["out"], level: "trace" } }
});
const logger = log4js.getLogger("out");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hello-world-997df.firebaseio.com"
});

if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test") {
  const config = {
    apiKey: "AIzaSyC0kRZCXNmSwc6AnTA8RLIcxILhiaIy1Po",
    authDomain: "hello-world-997df.firebaseapp.com",
    databaseURL: "https://hello-world-997df.firebaseio.com",
    projectId: "hello-world-997df",
    storageBucket: "hello-world-997df.appspot.com",
    messagingSenderId: "739465086298",
    appId: "1:739465086298:web:5677cc4b52754c17"
  };
  var firebase = require("firebase");
  firebase.initializeApp(config);
  const auth = firebase.auth();

  let tokenId = "Bearer ";
  auth.signInWithEmailAndPassword("tudor@adrian.ro", "1234qwer!").then(user => {
    console.log("Login user");
  });
  process.on("SIGINT", () => {
    auth.signOut().then(() => {
      console.log("Signed out");
    });
  });
  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      firebase
        .auth()
        .currentUser.getIdToken()
        .then(function(token) {
          tokenId = token;
        })
        .catch(function(error) {
          throw error;
        });
      return {
        logger,
        admin,
        verifyToken,
        tokenId,
        pubsub,
        knexModule
      };
    },
    debug: true
  });

  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
} else {
  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const idToken = token.replace("Bearer ", "");
      return {
        admin,
        idToken,
        pubsub,
        knex,
        knexModule
      };
    },
    debug: true
  });

  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}
