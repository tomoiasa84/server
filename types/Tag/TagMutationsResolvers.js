const cardMutationsResolver = {

    Mutation:{
        update_tag: (root,{ tagId,name },{ knex }) => {
            
            return knex('Tags')
            .where('id',tagId)
            .update({
                name:name
            })
            .then((updated) => {
                
                if(updated) return knex('Tags').where('id',tagIds[0]).first();
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
        delete_tag: (root,{tagId},{ knex }) => {

            return knex('Tags').where('id',tagId).del()
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
        create_tag: (root,{ name },{ knex }) => {
            
            return knex('Tags')
            .returning('id')
            .insert({
                name:name
            })
            .then((tagIds) => {
                
                return knex('Tags').where('id',tagIds[0]).first()
            })
            .catch((err) => {

                return {
                    id:0
                }
            })
        }
        
    }
}
module.exports = cardMutationsResolver;