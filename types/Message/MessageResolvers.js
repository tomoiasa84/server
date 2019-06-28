const messageResolvers = {

    Query:{
        get_message: (root,{ msgId },{ knex }) =>{

            return knex('Messages').where('id',msgId).first();
        },
        get_messages: (root, args, { knex }) => {
            
            return knex('Messages').select();
        }
    },
    Message:{
        messageThread: (message, args, { knex }) => {

            return knex('MessageThreads').where('id',message.messageThread).first()
            .catch(err => {
                console.log(err);
                return {
                    id: 0
                }
            })
        },
        from: (message, args, { knex }) => {

            return knex('Users').where('id',message.from).first()
            .catch(err => {
                console.log(err);
                return {
                    id: 0
                }
            })
        }

    }
}
module.exports = messageResolvers;