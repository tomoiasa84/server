const reviewResolvers = {
  Query: {
    get_review: (
      root,
      { reviewId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: get_review with id: ${reviewId}`
          );
          return knexModule.getById("TagReviews", reviewId);
        })
        .catch(function(error) {
          logger.error(error);
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
          logger.trace(`User: ${res.uid} Operation: get_reviews`);
          return knexModule.getAll("TagReviewsv");
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  },
  Review: {
    author: (review, args, { knexModule }) => {
      return knexModule.getById("Users", review.user).catch(error => {
        logger.error(error);
        throw error;
      });
    },
    userTag: (review, args, { knexModule }) => {
      return knexModule.getById("UserTags", review.userTag).catch(error => {
        logger.error(error);
        throw error;
      });
    }
  }
};

module.exports = reviewResolvers;
