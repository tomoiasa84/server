const threadMessageMutationsResolvers = {

    Mutation: {
        delete_threadmessage: (root, {
            threadMessageId,
        }, {
            knex
        }) => {

            return knex('MessageThreads').where('id', threadMessageId).del()
                .then((deleted) => {

                    if (deleted) return threadMessageId;
                    return 0;
                })
                .catch((err) => {

                    return 0;
                })
        },
        update_threadmessage: (root, {
            threadMessageId,
            userRecomCard
        }, {
            knex
        }) => {
            
            return knex('MessageThreads')
            .where('id',threadMessageId)
            .update({
                recommandation: userRecomCard
            })
            .then(updated => {

                if(updated) return knex('MessageThreads').where('id',threadMessageId).first();
                return {
                    id:0
                }
            })
            .catch(err => {
                
                console.log(err);
                return {
                    id:0
                }
            })
        },
        //User that starts conversations generates first entry
        create_threadmessage: (root, {
            //Need 2 users to start conversation
            userRecomCard,
            originUserId,
            targetUserId
        }, {
            knex
        }) => {


            return knex('MessageThreads')
                .returning('id')
                .insert({
                    recommandation: userRecomCard
                })
                .then(threadIds => {

                    let promises = [];
                    //create origin user thread
                    promises.push(
                        knex.insert({
                            user: originUserId,
                            thread: threadIds[0]
                        })
                        .returning('id')
                        .into('UserMessageThreads')
                    );
                    //create target user thread
                    promises.push(
                        knex.insert({
                            user: targetUserId,
                            thread: threadIds[0]
                        })
                        .returning('id')
                        .into('UserMessageThreads')
                    );
                    return Promise.all(promises)
                        .then(done => {

                            return done.flat();
                        })
                })
                .catch(err => {
                    console.log(err);

                })
        }
    }

}
module.exports = threadMessageMutationsResolvers;