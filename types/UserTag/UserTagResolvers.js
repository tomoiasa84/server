const userTagResolvers = {

    Query:{

        get_userTags: (root,args,{ knex }) => {

            return knex('UserTags').select()
                .catch(err => {
                    console.log(err);
                    return [];
                });
        },
        get_userTag: (root,{ userTagId },{ knex }) => {

            return knex('UserTags')
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

            return knex('Users')
                .where('id',userTag.user)
                .first()
                .catch(err => {
                    console.log(err);
                    return {
                        id: 0
                    }
                })
        },
        tag: (userTag,args,{ knex }) => {

            return knex('Tags')
                .where('id',userTag.tag)
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