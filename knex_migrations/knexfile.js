module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "1234qwer!",
      database: "xfriend"
    },
    pool: {
      min: 4,
      max: 20
    },
    acquireConnectionTimeout: 120000
  },

  test: {
    client: "pg",
    connection: {
      host: "xfriends.postgres.database.azure.com",
      user: "postgres@xfriends",
      password: "1234qwer!",
      database: "postgres"
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};
