const moment = require('moment');

const cardMutationsResolver = {
    Mutation: {
        delete_sharecard: (root, {
            sharecardId
        }, {
            knex
        }) => {

            return knex('Shares').where('id', sharecardId).del()
                .then(deleted => {

                    if (deleted) return sharecardId;
                    return 0;
                })
                .catch(err => {

                    return 0;
                })
        },
        create_sharecard: (root, {
            cardId,
            userIds
        }, {
            knex,
            pubsub
        }) => {


            if (userIds.length) {

                let promisesAwait = [];
                userIds.forEach(userId => {

                    promisesAwait.push(
                        //Insert into sharecard
                        knex('Shares')
                        .returning('id')
                        .insert({

                            card: cardId,
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
        delete_card: (root, {
            cardId
        }, {
            knex,
            pubsub
        }) => {


            return knex('Cards').where('id', cardId).del()
                .then((data) => {

                    if (data) return cardId;
                    return 0;
                })
                .catch((err) => {

                    return 0;
                })
        },
        update_card: (root, {
            cardId,
            tag,
            message
        }, {
            knex,
            pubsub
        }) => {

            return knex('Cards').where('id', cardId)
                .update({
                    searchFor: tag,
                    message: message,
                })
                .then((result) => {

                    return knex('Cards').where('id', cardId)
                        .first()
                        .then(card => {

                            pubsub.publish(`cardUpdate ${card.postedBy}`, {
                                cardUpdateSub: card
                            })
                            return card;
                        })

                })
                .catch((err) => {

                    return {
                        id: 0
                    }
                })
        },
        create_card(root, {
            postedBy,
            searchFor,
            text
        }, {
            knex,
            pubsub
        }) {

            return knex.insert({
                    postedBy,
                    searchFor,
                    text,
                    createdAt: `${moment()}`
                })
                .returning('id')
                .into('Cards')
                .then((cardIds) => {

                    return knex('Cards').where({
                            id: cardIds[0]
                        }).first()
                        .then(card => {
                            // pubsub.publish(`createCard ${postedBy}`, {
                            //     cardUpdateSub: card
                            // })
                            return card;
                        })

                })
                .catch((err) => {

                    console.log(err);
                    
                    return {
                        id:0
                    };
                })

        }
    }
}
module.exports = cardMutationsResolver;