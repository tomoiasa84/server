const knex = require('../../db/pgAdaptop');

const locationResolvers = {
    Query: {
      get_location: (root,{locationId},context) => {

        return knex('location').where('id',locationId).first();
      },
      get_locations: (root, args, context) => {
        
        return knex('location').select()
        .then((locations)=>{

          return locations;
        }) 
       },
    },
  };
module.exports = locationResolvers;