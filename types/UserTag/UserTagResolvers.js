const userTagResolvers = {

    Query:{

        get_userTags: (root,args,{ knex }) => {

            return knex('usertag').select()
                .catch(err => {
                    console.log(err);
                    return [];
                });
        },
        get_userTag: (root,{ userTagId },{ knex }) => {

            return knex('usertag')
                .where('id',userTagId)
                .first()
                .catch(err => {
                    console.log(err);
                    return {
                        id: 0
                    }
                });
        }
        
    },
    UserTag: {

        user: (userTag, args, { knex }) => {

            return knex('userx')
                .where('id',userTag.user_id)
                .first()
                .catch(err => {
                    console.log(err);
                    return {
                        id: 0
                    }
                })
        },
        tag: (userTag,args,{ knex }) => {

            return knex('tag')
                .where('id',userTag.tag_id)
                .first()
                .catch(err => {
                    console.log(err);
                    return {
                        id: 0
                    }
                })
        },
    }
}
module.exports = userTagResolvers;