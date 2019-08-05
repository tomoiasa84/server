const recommandResolvers = {
  Query: {
    get_recommands: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: get_recommands`);
          return knexModule.getAll("Recommands");
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    get_recommand: (
      root,
      { recommandId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: get_recommand with id: ${recommandId}`
          );
          return knexModule.getById("Recommands", recommandId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  },
  Recommand: {
    card: (parent, args, { knexModule }) => {
      return knexModule.getById("Cards", parent.card).catch(error => {
        logger.error(error);
        throw error;
      });
    },
    userAsk: (parent, args, { knexModule }) => {
      return knexModule.getById("Users", parent.userAsk).catch(error => {
        logger.error(error);
        throw error;
      });
    },
    userSend: (parent, args, { knexModule }) => {
      return knexModule.getById("Users", parent.userSend).catch(error => {
        logger.error(error);
        throw error;
      });
    },
    userRecommand: (parent, args, { knexModule }) => {
      return knexModule.getById("Users", parent.userRecommand).catch(error => {
        logger.error(error);
        throw error;
      });
    }
  }
};
module.exports = recommandResolvers;
