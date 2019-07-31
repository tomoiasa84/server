const reviewMutationsResolvers = {
  Mutation: {
    delete_review: (
      root,
      { reviewId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.deleteById("TagReviews", reviewId);
        })
        .catch(function(error) {
          logger.debug(error);
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
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.updateById("TagReviews", reviewId, {
            stars: stars,
            text: text
          });
        })
        .catch(function(error) {
          logger.debug(error);
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
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.insert("TagReviews", {
            user: userId,
            userTag: userTagId,
            stars: stars,
            text: text
          });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  }
};

module.exports = reviewMutationsResolvers;
