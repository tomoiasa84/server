require("dotenv").config();
const { PubSub, ApolloServer, gql } = require("apollo-server");
const admin = require("firebase-admin");
const serviceAccount = require("./db/adminkey");
const knex = require("./db/pgAdaptop");
const knexModule = require("./db/knexModule");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hello-world-997df.firebaseio.com"
});

if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test") {
  const testUserUID = "Z813vK0V7jQLNe0wOF1cJ97YgI83";
  const jwt = require("jsonwebtoken");
  const token = jwt.sign({ uid: testUserUID }, "secret");
  console.log(token);

  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        testUserUID,
        jwt,
        token,
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
