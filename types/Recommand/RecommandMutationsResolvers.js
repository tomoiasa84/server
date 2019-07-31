const recommandMutationsResolvers = {
  Mutation: {
    delete_recommand: (
      root,
      { recommandId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.deleteById("Recommands", recommandId);
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    update_recommand: (
      root,
      { recommandId, cardId, userAsk, userSend, userRec },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.updateById("Recommands", recommandId, {
            card: cardId,
            userAsk,
            userSend,
            userRecommand: userRec,
            acceptedFlag: false
          });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    create_recommand: (
      root,
      { cardId, userAsk, userSend, userRec },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.insert("Recommands", {
            card: cardId,
            userAsk: userAsk,
            userSend: userSend,
            userRecommand: userRec,
            acceptedFlag: false
          });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  }
};

module.exports = recommandMutationsResolvers;
