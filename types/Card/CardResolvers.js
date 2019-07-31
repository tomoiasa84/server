const cardResolvers = {
  Query: {
    get_cards: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.getAll("Cards");
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    get_card: (
      root,
      { cardId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.getById("Cards", cardId);
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  },
  Card: {
    searchFor: (card, args, { knexModule }) => {
      return knexModule.getById("Tags", card.searchFor).catch(error => {
        throw error;
      });
    },
    postedBy: (card, args, { knexModule }) => {
      return knexModule.getById("Users", card.postedBy).catch(error => {
        throw error;
      });
    }
  }
};
module.exports = cardResolvers;
