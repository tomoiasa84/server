const recommandMutationsResolvers = {

    Mutation: {
        delete_recommand: (root, {
            recommandId
        }, {
            knex
        }) => {

            return knex('userrecomcard').where('id', recommandId).del()
                .then((deleted) => {

                    if (deleted) return recommandId;
                    return 0;
                })
                .catch((err) => {

                    return 0;
                })
        },
        update_recommand: (root, {
            recommandId,
            cardId,
            userAsk,
            userSend,
            userRec
        }, {
            knex
        }) => {

            return knex
                .where('id', recommandId)
                .update({
                    cardId: cardId,
                    userAsk: userAsk,
                    userRecommender: userSend,
                    userRecommended: userRec,
                    acceptedFlag: false
                })
                .then((updated) => {

                    if (updated) return knex('userrecomcard').where('id', data[0]).first();
                    return {
                        id: 0
                    }

                })
                .catch((err) => {

                    console.log(err);
                    return {
                        id: 0
                    }
                })
        },
        create_recommand: (root, {
            cardId,
            userAsk,
            userSend,
            userRec
        }, {
            knex
        }) => {

            return knex.insert({
                    cardId: cardId,
                    userAsk: userAsk,
                    userRecommender: userSend,
                    userRecommended: userRec,
                    acceptedFlag: false
                })
                .returning('id')
                .into('userrecomcard')
                .then((recommandIds) => {

                    return knex('userrecomcard').where('id', recommandIds[0]).first();
                    // .then(recommand => {


                    // })

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