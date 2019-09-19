const tagResolvers = {
  Query: {
    get_tags: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      if (tokenId === "") {
        logger.trace(`User: get_tags`);
        return knexModule.getAll("Tags");
      }
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: get_tags`);
          return knexModule.getAll("Tags");
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    get_tag: (
      root,
      { tagId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      if (tokenId === "") {
        logger.trace(`User: operation: get_tag with id: ${tagId}`);
        return knexModule.getById("Tags", tagId);
      }
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: get_tag with id: ${tagId}`);
          return knexModule.getById("Tags", tagId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  }
};
module.exports = tagResolvers;
