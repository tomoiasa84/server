const knex = require('../../db/pgAdaptop');

const userResolvers = {
    Query: {
      users: async (_, args, ctx) => {
        const users = await knex('userx').select()
        return users
       }
    }
  };
module.exports = userResolvers;