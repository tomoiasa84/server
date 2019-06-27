
const cardResolvers = {
    Query: {
      get_cards: (root, args, { knex }) => {
        
        return knex('card').select()
        .then((cards)=>{

          return cards;
        }) 
       },
       get_card: (root,{cardId},{ knex })=>{

        return knex('card').where('id',cardId)
        .first()
       }
    },
    Card: {

      searchFor:(card, args, { knex })=>{
        
        return knex('tag').where('id',card.searchFor).first();
      },
      postedBy:(card, args, { knex })=>{

        return knex('userx').where('id',card.postedBy).first();
      }
    }
  };
module.exports = cardResolvers;