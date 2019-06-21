const threadMessageResolver = {

    Query:{

        get_threadmessages: (root,args,{ knex }) => {

            return knex('message_thread').select();
        }
    },
    ThreadMessage: {
        recommandCard: (threadMsg,args,{ knex }) => {

            return knex('userrecomcard').where('id',threadMsg.userrecomcard).first();
        },
        messages: (threadMsg,args,{ knex }) => {

            return knex('message').where('messageThread',threadMsg.id);
        },
        users: (threadMsg,args,{ knex }) => {

            return knex('message_thread_user').where({

                thread: threadMsg.id
            })
            .then((userThreadsRecords) => {

                let users = []
                if(userThreadsRecords.length){

                    userThreadsRecords.forEach(element => {
                        
                        users.push(knex('userx').where('id',element.user).first());
                    });
                    return Promise.all(users);
                }
            })
            .catch(err => {
                console.log(err);
                return [];
                
            })
        }
    }
}
module.exports = threadMessageResolver;