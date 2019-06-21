const knex = require('../../db/pgAdaptop');

const locationMutationsResolver = {

    Mutation: {
        add_location: (root,{city},{ knex }) => {

            return knex('location').insert({
                city:city
            })
            .then((data) => {

                if(data){
                    
                    return {
                        status:'ok',
                        message: 'Location added.'
                    }
                }
            })
            .catch((err) => {

                if(err){

                    return {
                        status:'bad',
                        message: 'Error in location add.'
                    }
                }
            })
        }
    }
}
module.exports = locationMutationsResolver;