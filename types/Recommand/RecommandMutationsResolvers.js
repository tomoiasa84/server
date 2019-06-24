const recommandMutationsResolvers = {

    Mutation:{

        recommend_card: (root,{
            cardId,
            userAsk,
            userSend,
            userRec
        },{ knex }) => {
        
            return knex.insert({
        
                cardId:cardId,
                userAsk: userAsk,
                userRecommender: userSend,
                userRecommended: userRec,
                acceptedFlag: false
            })
            .returning('id')
            .into('userrecomcard')
            .then((data) => {

                console.log(`Inserted new Recommandation ${data[0]}.`);
                
                if(data.length){
                    //return data[0];
                    return knex('userrecomcard')
                    .where('id',data[0])
                    .first();
                }
            })
            .catch((err) => {

                console.log(err);
                return {
                    id: 0
                }
            })
        },
    }
}

module.exports = recommandMutationsResolvers;

