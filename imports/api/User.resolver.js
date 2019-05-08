const knex = require('./pgAdaptor');

export default {
    Query:{
       
       users: async (_, args, ctx) => {
        const users = await knex('userx').select()
        return users
       }
      }
}

