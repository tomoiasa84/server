export default {
    Mutation: {
        commentRecomandationCreate(_, { recommandationId, contactId }, { db }) {
            // const recommandationComment = db.comments.findOne({ contactId, recommandationId })
            // if (recommandationComment) {
            //     throw new Meteor.Error('Comment is already in database')
            // }
            
            const { commentIds } = db.recommandations.findOne(recommandationId);
            console.log(commentIds[0])
            return db.comments.update( commentIds[0], {
                    $set: {
                        recommandationId,
                        contactId
                    }
                });

        },

        // commentRecomandationDelete(_, { optionId }, { db }){
        //     return db.decisionOptions.remove(optionId);
        // },

        // commentRecomandationUpdate(_, { optionId, data }, { db }){
        //     return db.decisionOptions.update( optionId ,{
        //         $set: {...data}
        //     });
        // },
    }
}