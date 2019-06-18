const knex = require('../../db/pgAdaptop');

const cardMutationsResolver = {

    Mutation:{
        
        default_tag: (root,{usertagId},context) => {

            return knex('usertag').where('id',usertagId).update({

                default:true
            })
            .then((data) => {

                return {
                    
                    status:'ok',
                    message: 'Update success.'
                }
            })
            .catch((err) => {

                return {
                    status:'bad',
                    message:`Code: ${err.code} Detail: ${err.detail}`
                }
            })
        },
        remove_usertag: (root,{usertagId},context) => {

            return knex('usertag').where('id',usertagId).del()
            .then((data) => {

                if(data){

                    return {

                        status: 'ok',
                        message: 'Usertag deleted.'
                    }
                }
                return {

                    status: 'bad',
                    message: 'Usertag does not exist.'
                }

            })
            .catch((err) => {

                return {
                    status: 'bad',
                    message: `Code: ${err.code} Detail: ${err.detail}.`
                }
            })
        },
        add_usertag: (root,{userId,tagId},context) => {

            return knex('usertag').insert({

                user_id:userId,
                tag_id:tagId,
                default:false
            })
            .then((data) => {

                return knex('usertag').where({

                    user_id:userId,
                    tag_id:tagId,
                }).first()
                .then((usertag) => {

                    return usertag.id
                })
            })
            .catch((err) => {

                return '0'
            })
        },
        delete_tag: (root,{tagId},context) => {

            return knex('tag').where('id',tagId).del()
            .then((data) => {

                if(data){

                    return {

                        status:'ok',
                        message: 'Tag deleted.'
                    }
                }
                return {
                    
                    status:'bad',
                    message: 'Tag does not exist.'
                }
            })
            .catch((err) => {

                return {

                    status: 'bad',
                    message: `Code: ${err.code} Detail: ${err.detail}.`
                }
            })
        },
        create_tag: (root,{name},context) => {
            
            return knex('tag').insert({
                name:name
            })
            .then((data) => {
                
                return knex('tag').where('name',name).first()
            })
            .catch((err) => {

                return {

                    id:'0'
                }
            })
        }
        
    }
}
module.exports = cardMutationsResolver;