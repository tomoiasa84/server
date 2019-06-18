const knex = require('../../db/pgAdaptop');

const reviewResolvers = {

    Query: {
        get_review: (root, {reviewId}, context) => {

            return knex('usertagreview').where('id',reviewId).first();
        },
        get_reviews: (root, args, context) => {

            return knex('usertagreview').select()
        }
    },
    Review:{

        recommendationBy: (review) => {

            return knex('userx').where('id',review.recommendationBy).first();
        },
        recommendationFor: (review) => {

            return knex('usertag').where('id',review.recommendationFor).first()
            .then((usertag) => {

                return knex('tag').where('id',usertag.tag_id).first();
            })
        }
    }
}

module.exports = reviewResolvers;