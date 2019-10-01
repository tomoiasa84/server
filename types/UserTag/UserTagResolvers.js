const userTagResolvers = {
  Query: {
    get_userTags: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: get_userTags`);
          return knexModule.getAll("UserTags");
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    get_userTag: (
      root,
      { userTagId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: get_userTag with id ${userTagId}`
          );
          return knexModule.getById("UserTags", userTagId);
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  },
  UserTag: {
    user: (userTag, args, { knexModule }) => {
      return knexModule.getById("Users", userTag.user).catch(error => {
        throw error;
      });
    },
    tag: (userTag, args, { knexModule }) => {
      return knexModule.getById("Tags", userTag.tag).catch(error => {
        throw error;
      });
    },
    reviews: (userTag, args, { knexModule }) => {
      return knexModule
        .get("TagReviews", { userTag: userTag.id })
        .catch(error => {
          throw error;
        });
    },
    score: (userTag, args, { knexModule }) => {
      return knexModule
        .knexRaw(
          `SELECT FLOOR(AVG(stars)) FROM "TagReviews" WHERE "userTag"='${userTag.id}';`
        )
        .then(result => {
          if (result[0]["floor"]) return result[0]["floor"];
          else return 0;
        })
        .catch(error => {
          throw error;
        });
    }
  }
};
module.exports = userTagResolvers;
