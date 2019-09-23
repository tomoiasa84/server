const userTagMutationsResolvers = {
  Mutation: {
    create_userTag: (
      root,
      { userId, tagId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          return knexModule
            .knexRaw(`SELECT * FROM "UserTags" WHERE "user"='${userId}';`)
            .then(countResult => {
              if (countResult.length === 0) {
                logger.trace(
                  `User: ${res.uid} Operation: delete_userTag with id ${userId}`
                );
                return knexModule.insert("UserTags", {
                  user: userId,
                  tag: tagId,
                  default: true
                });
              }
              logger.trace(
                `User: ${res.uid} Operation: delete_userTag with id ${userId}`
              );
              return knexModule.insert("UserTags", {
                user: userId,
                tag: tagId,
                default: false
              });
            });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    update_userTag: (
      root,
      { userTagId, defaultFlag },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: delete_userTag with id ${userTagId}`
          );
          return knexModule.updateById("UserTags", userTagId, {
            default: defaultFlag
          });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    delete_userTag: (
      root,
      { userTagId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: delete_userTag with id ${userTagId}`
          );
          return knexModule.deleteById("UserTags", userTagId);
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  }
};
module.exports = userTagMutationsResolvers;
