const recommandResolvers = {

    Query:{

        get_recommandations: (root,args,{ knex }) => {

            return knex('Recommandations').select();
        },
        get_recommandation: (root,{ recommandationId},{ knex }) => {

            return knex('Recommandations').where('id',recommandationId).first();
        }
    },
    Recommand: {

        card: (parent,args,{ knex }) => {

            return knex('Cards').where('id',parent.card).first();
        },
        userAsk: (parent,args,{ knex }) => {

            return knex('Users').where('id',parent.userAsk).first();
        },
        userSend: (parent,args,{ knex }) => {

            return knex('Users').where('id',parent.userSend).first();
        },
        userRecommand: (parent,args,{ knex }) => {

            return knex('Users').where('id',parent.userRecommand).first();
        }
    }

}
module.exports = recommandResolvers;