const knex = require('../../db/pgAdaptop');

const locationResolvers = {
    Query: {
      locations: (root, args, context) => {
        
        return knex('location').select()
        .then((locations)=>{

          return locations;
        }) 
       },
    },
  };
module.exports = locationResolvers;