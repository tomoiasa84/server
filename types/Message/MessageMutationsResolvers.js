const messageMutationsResolvers = {

    Mutation: {
        delete_message: (root, {
            messageId
        }, {
            knex
        }) => {
            
            return knex('message').where('id', messageId).del()
                .then((deleted) => {

                    if (deleted) return messageId;
                    return 0;
                })
                .catch((err) => {

                    return 0;
                })
        },
        update_message: (root, {
            messageId,
            text,
            msgThread,
            msgFrom
        }, {
            knex
        }) => {

            return knex('message')
                .where('id',messageId)
                .update({
                    text: text,
                    messageThread: msgThread,
                    messageFrom: msgFrom
                })
                .then(updated => {

                    if(updated) return knex('message').where('id', messageIds[0]).first();
                    return {
                        id:0
                    }
                })
                .catch(err => {

                    console.log(err);
                    return {
                        id: 0
                    }
                })
        },
        create_message: (root, {
            text,
            msgThread,
            msgFrom
        }, {
            knex
        }) => {

            return knex('message')
                .returning('id')
                .insert({
                    text: text,
                    messageThread: msgThread,
                    messageFrom: msgFrom
                })
                .then(messageIds => {

                    return knex('message').where('id', messageIds[0]).first();
                })
                .catch(err => {

                    console.log(err);
                    return {
                        id: 0
                    }
                })
        }
    }
}
module.exports = messageMutationsResolvers;