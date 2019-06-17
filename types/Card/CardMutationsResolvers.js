const knex = require('../../db/pgAdaptop');
const moment  = require('moment');

const cardMutationsResolver = {
    Mutation:{
        delete_card: (root,{cardId},context) => {

            return knex('card').where('id',cardId).del()
            .then((data) => {

                if(data){

                    return {
                        status: 'ok',
                        message: 'Card deleted.'
                    }
                }
                return {
                    status: 'bad',
                    message: 'Card does not exist.'
                }
            })
            .catch((err) => {

                return {
                    status: 'bad',
                    message: `Code: ${err.code} Detail: ${err.detail}.`
                }
            })
        },
        update_card:(root,{
            cardId,
            tag,
            message
        },context) => {

            return knex('card').where('id',cardId)
            .update({
                searchFor:tag,
                message: message,
            })
            .then((result) => {

                if(result){
                    
                    return {
                        status:'ok',
                        message: 'updated'
                    }
                }
                return {
                    status:'bad',
                    message: 'no update'
                }
                
            })
            .catch((err) => {

                return {
                    status:'bad',
                    message: err.error
                }
            })
        },
        create_card(root,{
            postedBy,
            searchFor,
            message
        },context){
                
                return knex('card').insert({
                    postedBy: postedBy,
                    searchFor: searchFor,
                    message: message,
                    created_at: `${moment()}`
                })
                .then((data) => {

                    return knex('card').where({
                        postedBy: postedBy,
                        searchFor: searchFor,
                        message: message
                    }).first();
                })
                .catch((err) => {
    
                    return knex('card').where({
                        postedBy: postedBy,
                        searchFor: searchFor,
                        message: message
                    }).first();
                })
                
            }
    }
}
module.exports = cardMutationsResolver;