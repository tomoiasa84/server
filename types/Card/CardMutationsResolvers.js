const moment  = require('moment');

const cardMutationsResolver = {
    Mutation:{
        delete_sharecard: (root, { sharecardId }, { knex }) => {

            return knex('sharecard').where('id',sharecardId).del()
            .then(deleted => {

                if(deleted) return sharecardId;
                return 0;
            })
            .catch(err => {

                return 0;
            })
        },
        create_sharecard:(root,{cardId,userIds},{knex,pubsub}) => {

            
            if(userIds.length){

                let promisesAwait = [];
                userIds.forEach(userId => {
                
                    promisesAwait.push(
                        //Insert into sharecard
                        knex('sharecard')
                            .returning('id')
                            .insert({
                            
                                cardId: cardId,
                                sharedBy: userId,
                            })
                            .then(ids => {
                                
                                return ids[0];
                            })
                            .catch(err => {
    
                                return 0;
                            })
                        )
                    });
                return Promise.all(promisesAwait)
                .then(shareIds => {
    
                    return shareIds;
                })
                .catch(err => {
    
                    console.log(err);
                    return [];
                })
            }
            return [];
            
        },
        delete_card: (root,{cardId},{ knex,pubsub }) => {

            
            return knex('card').where('id',cardId).del()
            .then((data) => {

                if(data) return cardId;
                return 0;
            })
            .catch((err) => {

                return 0;
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