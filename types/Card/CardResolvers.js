const knex = require('../../db/pgAdaptop');

const cardResolvers = {
    Query: {
      get_cards: (root, args, context) => {
        
        return knex('card').select()
        .then((cards)=>{

          return cards;
        }) 
       },
       get_card: (root,{cardId},context)=>{

        return knex('card').where('id',cardId)
        .first()
       }
    },
    Card: {

      searchFor:(card)=>{
        
        return knex('tag').where('id',card.searchFor).first();
      },
      postedBy:(card)=>{

        return knex('userx').where('id',card.postedBy).first();
      }
    }
  };
module.exports = cardResolvers;