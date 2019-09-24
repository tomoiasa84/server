module.exports = {
  Mutation: {
    delete_share: (
      root,
      { shareId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: delete_share with id: ${shareIds}`
          );
          return knexModule.deleteById("Shares", shareId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    create_share: (
      root,
      { cardId, sharedBy, sharedTo },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: create_share`);
          return knexModule.insert("Shares", {
            card: cardId,
            sharedBy,
            sharedTo
          });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  }
};
