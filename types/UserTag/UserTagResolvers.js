const userTagResolvers = {

    Query:{

        get_userTags: (root,args,{ knex }) => {

            return knex('usertag').select();
        },
        get_userTag: (root,{ userTagId },{ knex }) => {

            return knex('usertag')
                .where('id',userTagId)
                .first()
        }
        
    },
    UserTag: {

        user: (userTag,args,{ knex }) => {

            return knex('userx')
                .where('id',userTag.user_id)
                .first()
        },
        tag: (userTag,args,{ knex }) => {

            return knex('tag')
                .where('id',userTag.tag_id)
                .first()
        },
    }
}
module.exports = userTagResolvers;