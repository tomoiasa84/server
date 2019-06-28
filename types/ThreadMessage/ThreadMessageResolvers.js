const threadMessageResolvers = {

    Query: {

        get_threadmessages: (root, args, {
            knex
        }) => {

            return knex('MessageThreads').select();
        },
        get_threadmessage: (root, {
            threadMessageId
        }, {
            knex
        }) => {

            return knex('MessageThreads').where('id', threadMessageId).first()
            .catch(err => {

                console.log(err);
                return {
                    id:0
                }
            })
        }
    },
    ThreadMessage: {
        recommandCard: (threadMsg, args, {
            knex
        }) => {

            return knex('Recommandations').where('id', threadMsg.userrecomcard).first();
        },
        messages: (threadMsg, args, {
            knex
        }) => {

            return knex('Messages').where('messageThread', threadMsg.id);
        },
        users: (threadMsg, args, {
            knex
        }) => {

            return knex('UserMessageThreads').where({

                    thread: threadMsg.id
                })
                .then((userThreadsRecords) => {

                    let users = []
                    if (userThreadsRecords.length) {

                        userThreadsRecords.forEach(element => {

                            users.push(knex('Users').where('id', element.user).first());
                        });
                        return Promise.all(users);
                    }
                })
        }
    }
}
module.exports = threadMessageResolvers;