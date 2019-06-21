const messageResolvers = {

    Query:{
        get_message: (root,{ msgId },{ knex }) =>{

            return knex('message').where('id',msgId).first();
        },
        get_messages: (root, args, { knex }) => {
            
            return knex('message').select();
        }
    }
}
module.exports = messageResolvers;