const knex = require('../../db/pgAdaptop');
const moment  = require('moment');

const cardMutationsResolver = {
    Mutation:{
        update_card:(root,{
            cardId,
            tag,
            message
        },context) => {

            return knex('card').where('id',cardId)
            .update({
                searchFor:tag,
                message: message
            })
            .then((result) => {

                if(result){
                    
                    return {
                        status:'ok',
                        message: 'updated'
                    }
                }
                return {
                    status:'bad',
                    message: 'no update'
                }
                
            })
            .catch((err) => {

                return {
                    status:'bad',
                    message: err.error
                }
            })
            // .then((data) => {

            //     if(data){

            //         return knex('card').where('id',data.id)
            //         .update({
            //             searchFor: tag,
            //             message: message
            //         })
            //         .then((result) =>{

            //             console.log(result);
            //             return {
            //                 status: 'ok',
            //                 message: 'updated'
            //             }
                        
            //         })
            //     }
            //     return {
            //         status:'bad',
            //         message:'Card does not exist'
            //     }
            // })
            // .catch((err) => {
            //     return {
            //         status:'bad',
            //         message:err.error
            //     }
            // })
        },
        create_card(root,{postedBy,
            searchFor,
            message},context){
                //console.log('hit this');
                
                return knex('card').where({
                    postedBy: postedBy,
                    searchFor: searchFor,
                    message: message
                })
                .first()
                .then((card)=>{

                    if(card){

                        return {
                            status: 'bad',
                            message: 'Card already exists.'
                        }
                    }
                    return knex('card').insert({

                        postedBy: postedBy,
                        searchFor: searchFor,
                        created_at: `${moment()}`,
                        message: message
                    })
                    .then((data)=>{
                        //console.log(data);
                        return {
                            status: 'ok',
                            message: 'Card created'
                        }
                    })
                    .catch((err)=>{

                        return{
                            status:'bad',
                            message: err.error
                        }
                    })
                })
            }
    }
}
module.exports = cardMutationsResolver;