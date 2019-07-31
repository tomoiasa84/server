const cardMutationsResolver = {
  Mutation: {
    update_tag: (
      root,
      { tagId, name },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.updateById("Tags", tagId, {
            name
          });
        })
        .catch(function(error) {
          logger.debug(error);
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
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.deleteById("Tags", tagId);
        })
        .catch(function(error) {
          logger.debug(error);
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
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.insert("Tags", {
            name
          });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  }
};
module.exports = cardMutationsResolver;
