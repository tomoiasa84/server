const reviewMutationsResolvers = {
  Mutation: {
    delete_review: (
      root,
      { reviewId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: delete_review with id: ${reviewId}`
          );
          return knexModule.deleteById("TagReviews", reviewId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    update_review: (
      root,
      { reviewId, stars, text },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: update_review with id: ${reviewId}`
          );
          return knexModule.updateById("TagReviews", reviewId, {
            stars: stars,
            text: text
          });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    create_review: (
      root,
      { userId, userTagId, stars, text },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: create_review`);
          return knexModule.insert("TagReviews", {
            user: userId,
            userTag: userTagId,
            stars: stars,
            text: text
          });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  }
};

module.exports = reviewMutationsResolvers;
