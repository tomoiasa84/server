const knex = require('../../db/pgAdaptop');

const recommandMutationsResolvers = {

    Mutation:{

        recommend_card: (root,{
            cardId,
            userAsk,
            userSend,
            userRec
        },context) => {
        
            return knex('userrecomcard').insert({
        
                cardId:cardId,
                userAsk: userAsk,
                userRecommender: userSend,
                userRecommended: userRec,
                acceptedFlag: false
            })
            .then((data) => {

                if(data){
                    return knex('userrecomcard')
                    .where({
        
                        cardId:cardId,
                        userAsk: userAsk,
                        userRecommender: userSend,
                        userRecommended: userRec,
                        acceptedFlag: false
                    })
                    .first();
                }
            })
            .catch((err) => {

                return {
                    id: 0
                }
            })
        },
    }
}

module.exports = recommandMutationsResolvers;

