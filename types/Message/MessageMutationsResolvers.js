const messageMutationsResolvers = {

    Mutation:{

        create_message: (root, {
            text,
            msgThread,
            msgFrom
        }, { knex }) => {
            
            return knex.insert({
                text:text,
                messageThread:msgThread,
                messageFrom:msgFrom
            })
            .returning('id')
            .into('message')
            .then(msgId => {

                console.log(msgId);
                
                if(msgId.length){

                    return knex('message').where({
                        id:msgId[0]
                    }).first();
                }
                console.log('No insert.');
                
                return {
                    id: 0,
                    text: '',
                    messageThread:null,
                    messageFrom:null
                }
            })
            .catch(err => {
                console.log(err);
                
                return {
                    id: 0,
                    text: '',
                    messageThread:null,
                    messageFrom:null
                }
            })
        }
    }
}
module.exports = messageMutationsResolvers;