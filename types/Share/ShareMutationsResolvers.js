module.exports = {
  Mutation: {
    delete_share: (
      root,
      { shareIds },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: delete_share with id: ${shareIds}`
          );
          let promisesArray = [];
          if (shareIds.length) {
            shareIds.forEach(id => {
              promisesArray.push(knexModule.deleteById("Shares", id));
            });
          }
          return Promise.all(promisesArray).catch(error => {
            logger.error(error);
            throw error;
          });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    create_share: (
      root,
      { cardId, sharedBy, sharedTo },
      { knexModule, pubsub, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: create_share`);
          if (sharedTo.length) {
            let promisesAwait = [];
            sharedTo.forEach(userId => {
              promisesAwait.push(
                //Insert into sharecard
                knexModule
                  .insert("Shares", {
                    card: cardId,
                    sharedBy,
                    sharedTo: userId
                  })
                  .then(share => {
                    return share.id;
                  })
              );
            });
            return Promise.all(promisesAwait)
              .then(sharedTos => {
                return sharedTos;
              })
              .catch(error => {
                logger.error(error);
                throw error;
              });
          }
          return [];
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  }
};
