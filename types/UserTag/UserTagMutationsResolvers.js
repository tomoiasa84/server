const userTagMutationsResolvers = {

    Mutation:{

        create_userTag: (root,{userId,tagId},{ knex }) => {

            return knex('UserTags')
            .returning('id')
            .insert({

                user:userId,
                tag:tagId,
                default:false
            })
            .then((userTagIds) => {
                
                return knex('UserTags').where({
                    id:userTagIds[0]
                }).first()
                .then((usertag) => {

                    if(usertag) return usertag;
                    return {
                        id:0
                    }
                })
            })
            .catch((err) => {

                return {
                    id: 0
                }
            })
        },
        update_userTag: (root,{ userTagId, defaultFlag },{ knex }) => {

            return knex('UserTags')
                .where('id',userTagId)
                .update({default:defaultFlag})
                .then((updateRows) => {
                    
                    if(updateRows){

                        return knex('UserTags').where('id',userTagId).first();
                    }
                    return {
                        id:0
                    }
                })
                .catch((err) => {

                    console.log(err);
                    return {
                        id:0
                    }
                })
        },
        delete_userTag: (root,{ usertagId },{ knex }) => {

            return knex('UserTags').where('id',usertagId).del()
            .then((data) => {

                if(data){

                    return usertagId;
                }
                return 0;

            })
            .catch((err) => {

                console.log(err);
                return 0;
            })
        },

        
    },
}
module.exports = userTagMutationsResolvers;