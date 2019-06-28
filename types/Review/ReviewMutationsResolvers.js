const reviewMutationsResolvers = {

    Mutation: {
        delete_review: (root,{ reviewId },{ knex }) => {

            return knex('TagReviews').where('id',reviewId).del()
            .then(deleted => {
                
                if(deleted) return reviewId;
                return 0;
            })
            .catch(err => {

                console.log(err);
                return 0;
            })
        },
        update_review: (root, { reviewId, stars, text }, { knex }) => {

            return knex('TagReviews').where('id',reviewId)
            .update({

                stars: stars,
                text: text
            })
            .then((data) => {

                if(data) return knex('TagReviews').where('id',reviewId).first();
                return {
                    id: 0
                }
            })
            .catch((err) => {
                
                console.log(err);
                return {
                    id:0
                }
            })
        },
        create_review: (root,{ userId, userTagId, stars, text }, { knex }) => {
        
            return knex('TagReviews')
            .returning('id')
            .insert({
                user:userId,
                userTag:userTagId,
                stars:stars,
                text:text
            })
            .then((reviewIds) => {
        
                return knex('TagReviews')
                .where('id',reviewIds[0]).first();
            })
            .catch((err) => {
        
                return {
                    id: 0
                }
            })
        },
    }
}

module.exports = reviewMutationsResolvers;