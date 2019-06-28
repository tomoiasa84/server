const locationResolvers = {
    Query: {
      get_location: (root,{locationId},{ knex }) => {

        return knex('Locations').where('id',locationId).first();
      },
      get_locations: (root, args, { knex }) => {
        
        return knex('Locations').select()
        .then((locations)=>{

          return locations;
        }) 
       },
    },
  };
module.exports = locationResolvers;