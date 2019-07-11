const reviewMutationsResolvers = {
  Mutation: {
    delete_review: (root, { reviewId }, { knexModule }) => {
      return knexModule.deleteById("TagReviews", reviewId).catch(error => {
        throw error;
      });
    },
    update_review: (root, { reviewId, stars, text }, { knexModule }) => {
      return knexModule
        .updateById("TagReviews", reviewId, {
          stars: stars,
          text: text
        })
        .catch(error => {
          throw error;
        });
    },
    create_review: (
      root,
      { userId, userTagId, stars, text },
      { knexModule }
    ) => {
      return knexModule
        .insert("TagReviews", {
          user: userId,
          userTag: userTagId,
          stars: stars,
          text: text
        })
        .catch(error => {
          throw error;
        });
    }
  }
};

module.exports = reviewMutationsResolvers;
