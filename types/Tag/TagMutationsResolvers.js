const cardMutationsResolver = {
  Mutation: {
    update_tag: (
      root,
      { tagId, name },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: update_tag with id: ${tagId}`
          );
          return knexModule.updateById("Tags", tagId, {
            name
          });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    delete_tag: (
      root,
      { tagId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: delete_tag with id: ${tagId}`
          );
          return knexModule.deleteById("Tags", tagId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    create_tag: (
      root,
      { name },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: create_tag`);
          return knexModule.insert("Tags", {
            name
          });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  }
};
module.exports = cardMutationsResolver;
