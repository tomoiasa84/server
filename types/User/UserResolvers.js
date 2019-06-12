const knex = require('../../db/pgAdaptop');

const userResolvers = {
    Query: {
      users: (root, args, ctx) => {
        
        return knex('userx').select()
        .then((users)=>{
          
          return users;
        });
       }
    },
    User:{

      location(user) {

        return knex('location').where('id',user.location).first();
      },
    }
  };
module.exports = userResolvers;