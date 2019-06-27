const messageResolvers = {

    Query:{
        get_message: (root,{ msgId },{ knex }) =>{

            return knex('message').where('id',msgId).first();
        },
        get_messages: (root, args, { knex }) => {
            
            return knex('message').select();
        }
    },
    Message:{
        messageThread: (message, args, { knex }) => {

            return knex('message_thread').where('id',message.messageThread).first()
            .catch(err => {
                console.log(err);
                return {
                    id: 0
                }
            })
        },
        messageFrom: (message, args, { knex }) => {

            return knex('userx').where('id',message.messageFrom).first()
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