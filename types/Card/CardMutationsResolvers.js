const moment  = require('moment');

const cardMutationsResolver = {
    Mutation:{
        delete_card: (root,{cardId},{ knex }) => {

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
        },{ knex, pubsub }) => {

            return knex('card').where('id',cardId)
            .update({
                searchFor:tag,
                message: message,
            })
            .then((result) => {
                
                return knex('card').where('id',cardId)
                .first()
                .then(card => {

                    pubsub.publish('cardUpdate2',{ cardUpdateSub:card })
                    return card;
                })

            })
            .catch((err) => {

                return {
                    id:0
                }
            })
        },
        create_card(root,{
            postedBy,
            searchFor,
            message
        },{ knex, pubsub }){
                
                return knex.insert({
                    postedBy: postedBy,
                    searchFor: searchFor,
                    message: message,
                    created_at: `${moment()}`
                })
                .returning('id')
                .into('card')
                .then((cardId) => {

                    return knex('card').where({
                        id:cardId[0]
                    }).first()
                    .then(card => {
                        
                        pubsub.publish('cardUpdate',{ cardUpdateSub:card })
                        return card;
                    })
                    
                })
                .catch((err) => {
    
                    return null;
                })
                
            }
    }
}
module.exports = cardMutationsResolver;