const knex = require('../../db/pgAdaptop');

const locationResolvers = {
    Query: {
      get_location: (root,{locationId},{ knex }) => {

        return knex('location').where('id',locationId).first();
      },
      get_locations: (root, args, { knex }) => {
        
        return knex('location').select()
        .then((locations)=>{

          return locations;
        }) 
       },
    },
  };
module.exports = locationResolvers;