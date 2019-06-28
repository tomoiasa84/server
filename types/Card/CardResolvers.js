
const cardResolvers = {
    Query: {
      get_cards: (root, args, { knex }) => {
        
        return knex('Cards').select()
        .then((cards)=>{

          return cards;
        }) 
       },
       get_card: (root,{cardId},{ knex })=>{

        return knex('Cards').where('id',cardId)
        .first()
       }
    },
    Card: {

      searchFor:(card, args, { knex })=>{
        
        return knex('Tags').where('id',card.searchFor).first();
      },
      postedBy:(card, args, { knex })=>{

        return knex('Users').where('id',card.postedBy).first();
      }
    }
  };
module.exports = cardResolvers;