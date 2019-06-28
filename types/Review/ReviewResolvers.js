const reviewResolvers = {

    Query: {
        get_review: (root, {reviewId}, { knex }) => {

            return knex('TagReviews').where('id',reviewId).first();
        },
        get_reviews: (root, args, { knex }) => {

            return knex('TagReviewsv').select()
        }
    },
    Review:{

        author: (review) => {

            return knex('Users').where('id',review.user).first();
        },
        userTag: (review) => {

            return knex('UserTags').where('id',review.userTag).first()
            .then((usertag) => {

                return knex('Tags').where('id',usertag.tag).first();
            })
        }
    }
}

module.exports = reviewResolvers;