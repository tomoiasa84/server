const userTagMutationsResolvers = {

    Mutation:{

        creat_userTag: (root,{userId,tagId},{ knex }) => {

            return knex('usertag')
            .returning('id')
            .insert({

                user_id:userId,
                tag_id:tagId,
                default:false
            })
            .then((userTagId) => {

                return knex('usertag').where({
                    id:userTagId
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

            return knex('usertag')
                .where('id',userTagId)
                .update({default:defaultFlag})
                .then((updateRows) => {
                    
                    if(updateRows){

                        return knex('usertag').where('id',userTagId).first();
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

            return knex('usertag').where('id',usertagId).del()
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