const knex = require('../../db/pgAdaptop');
const moment  = require('moment');

const cardMutationsResolver = {
    Mutation:{

        create_card(root,{postedBy,
            searchFor,
            message},context){
                //console.log('hit this');
                
                return knex('card').where({
                    postedBy: postedBy,
                    searchFor: searchFor,
                    message: message
                })
                .first()
                .then((card)=>{

                    if(card){

                        return {
                            status: 'bad',
                            message: 'Card already exists.'
                        }
                    }
                    return knex('card').insert({

                        postedBy: postedBy,
                        searchFor: searchFor,
                        created_at: `${moment()}`,
                        message: message
                    })
                    .then((data)=>{
                        //console.log(data);
                        return {
                            status: 'ok',
                            message: 'Card created'
                        }
                    })
                    .catch((err)=>{

                        return{
                            status:'bad',
                            message: err.error
                        }
                    })
                })
            }
    }
}
module.exports = cardMutationsResolver;