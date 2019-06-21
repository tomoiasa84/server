const messageMutationsResolvers = {

    Mutation:{

        create_message: (root, {
            text,
            msgThread,
            msgFrom
        }, { knex }) => {
            
            return knex('message').insert({
                text:text,
                messageThread:msgThread,
                messageFrom:msgFrom
            })
            .then(data => {

                if(data){

                    return knex('message').where({
                        text:text,
                        messageThread:msgThread,
                        messageFrom:msgFrom
                    }).first();
                }
                return {
                    id: null,
                    text: null,
                    messageThread:null,
                    messageFrom:null
                }
            })
            .catch(err => {

                return {
                    id: null,
                    text: null,
                    messageThread:null,
                    messageFrom:null
                }
            })
        }
    }
}
module.exports = messageMutationsResolvers;