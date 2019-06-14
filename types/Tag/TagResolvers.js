const knex = require('../../db/pgAdaptop');

const tagResolvers = {
    Query: {
      tags: (root, args, context) => {
        
        return knex('tag').select()
        .then((tags)=>{

          return tags;
        }) 
       },
    },
  };
module.exports = tagResolvers;