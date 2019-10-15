// const knex = require("knex");
// // Initialize Knex, a Node.js SQL query builder library with built-in connection pooling.
// module.exports = connect();

// function connect() {
//   // Configure which instance and what database user to connect with.
//   // Remember - storing secrets in plaintext is potentially unsafe. Consider using
//   // something like https://cloud.google.com/kms/ to help keep secrets secret.
//   const config = {
//     user: "postgres", // e.g. 'my-user'
//     password: "yCz1HgLni5rCPvnI", // e.g. 'my-user-password'
//     database: "xfriends" // e.g. 'my-database'
//   };

//   config.host = "/cloudsql/xfriend:europe-west1:xfriends";

//   // Establish a connection to the database
//   const knexClient = knex({
//     client: "pg",
//     connection: config
//   });

//   // ... Specify additional properties here.
//   // ...
//   return knexClient;
// }

module.exports = require("knex")({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
});
