const knex = require('../../db/pgAdaptop');

const userResolver = {
    Query: {
      users: async (_, args, ctx) => {
        const users = await knex('userx').select()
        return users
       }
    }
  };
module.exports = userResolver;