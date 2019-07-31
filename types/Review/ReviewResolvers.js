const reviewResolvers = {
  Query: {
    get_review: (
      root,
      { reviewId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.getById("TagReviews", reviewId);
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    get_reviews: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.getAll("TagReviewsv");
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  },
  Review: {
    author: (review, args, { knexModule }) => {
      return knexModule.getById("Users", review.user).catch(error => {
        throw error;
      });
    },
    userTag: (review, args, { knexModule }) => {
      return knexModule.getById("UserTags", review.userTag).catch(error => {
        throw error;
      });
    }
  }
};

module.exports = reviewResolvers;
