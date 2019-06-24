const threadMessageMutationsResolvers = {

    Mutation:{
        
        //User that starts conversations generates first entry
        create_threadmessage: (root,{
            //Need 2 users to start conversation
            userRecomCard,
            originUserId,
            targetUserId
        }, { knex }) => {
            
            
            return knex.insert({
                userrecomcard:userRecomCard
            })
            .returning('id')
            .into('message_thread')
            .then(threadId => {

                let promises = [];
                //create origin user thread
                promises.push(
                    knex.insert({
                        user:originUserId,
                        thread:threadId[0]
                    })
                    .returning('id')
                    .into('message_thread_user')
                );
                //create target user thread
                promises.push(
                    knex.insert({
                        user:targetUserId,
                        thread:threadId[0]
                    })
                    .returning('id')
                    .into('message_thread_user')
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