const reviewMutationsResolvers = {

    Mutation: {
        edit_review: (root, { 
            reviewId,
            stars,
            text
        }, { knex }) => {

            return knex('usertagreview').where('id',reviewId)
            .update({

                stars: stars,
                text: text
            })
            .then((data) => {

                return {

                    status: 'ok',
                    message: 'Review edited.'
                }
            })
            .catch((err) => {
                
                console.log(err);
                
                return {

                    status: 'bad',
                    message: 'Cannot edit review.'
                }
            })
        },
        add_review: (root,{

            userId,
            tagReview,
            stars,
            text
        }) => {
        
            return knex('usertagreview').insert({
        
                recommendationBy:userId,
                recommendationFor:tagReview,
                stars:stars,
                text:text
            })
            .then((data) => {
        
                return {
                    status:'ok',
                    message: 'Review added'
                }
            })
            .catch((err) => {
        
                return {
                    status:'bad',
                    message: 'Cannot add review.'
                }
            })
        },
    }
}

module.exports = reviewMutationsResolvers;