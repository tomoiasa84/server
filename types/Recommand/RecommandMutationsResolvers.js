const recommandMutationsResolvers = {
  Mutation: {
    delete_recommand: (
      root,
      { recommandId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_recommand`);
          return knexModule.deleteById("Recommands", recommandId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    update_recommand: (
      root,
      { recommandId, userRecId, accepted },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: update_recommand`);
          return knexModule.updateById("Recommands", recommandId, {
            userRecommand: userRecId,
            acceptedFlag: false
          });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    create_recommand: (
      root,
      { cardId, userAskId, userSendId, userRecId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: create_recommand`);
          return knexModule.insert("Recommands", {
            card: cardId,
            userAsk: userAskId,
            userSend: userSendId,
            userRecommand: userRecId,
            acceptedFlag: false
          });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  }
};

module.exports = recommandMutationsResolvers;
