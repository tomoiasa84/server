const recommandResolvers = {

    Query:{

        get_recommandations: (root,args,{ knex }) => {

            return knex('userrecomcard').select();
        }
    },
    Recommand: {

        card: (parent,args,{ knex }) => {

            return knex('card').where('id',parent.cardId).first();
        },
        userAsk: (parent,args,{ knex }) => {

            return knex('userx').where('id',parent.userAsk).first();
        },
        recommander: (parent,args,{ knex }) => {

            return knex('userx').where('id',parent.userRecommender).first();
        },
        recommanded: (parent,args,{ knex }) => {

            return knex('userx').where('id',parent.userRecommended).first();
        }
    }

}
module.exports = recommandResolvers;