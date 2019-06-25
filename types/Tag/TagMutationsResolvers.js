const cardMutationsResolver = {

    Mutation:{
        
        default_tag: (root,{usertagId},{ knex }) => {

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
        delete_tag: (root,{tagId},{ knex }) => {

            return knex('tag').where('id',tagId).del()
            .then((data) => {

                if(data){

                    return tagId
                }
                return 0;
            })
            .catch((err) => {

                return 0;
            })
        },
        create_tag: (root,{name},{ knex }) => {
            
            return knex('tag')
            .returning('id')
            .insert({
                name:name
            })
            .then((tagIds) => {
                
                return knex('tag').where('id',tagIds[0]).first()
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