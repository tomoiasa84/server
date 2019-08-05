const moment = require("moment");

const cardMutationsResolver = {
  Mutation: {
    delete_card: (
      root,
      { cardId },
      { knexModule, pubsub, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_card`);
          return knexModule.deleteById("Cards", cardId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    update_card: (
      root,
      { cardId, tag, message },
      { knexModule, pubsub, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: update_card`);
          return knexModule.updateById("Cards", cardId, {
            searchFor: tag,
            text: message
          });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    create_card(
      root,
      { postedBy, searchFor, text },
      { knexModule, pubsub, admin, verifyToken, tokenId, logger }
    ) {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_card`);
          return knexModule.insert("Cards", {
            postedBy,
            searchFor,
            text,
            createdAt: `${moment()}`
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
