const cardResolvers = {
  Query: {
    get_cards: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: get_cards`);
          return knexModule.getAll("Cards");
        })
        .catch(function(error) {
          logger.error(error);
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
          logger.trace(`User: ${res.uid} Operation: get_card with id {cardId}`);
          return knexModule.getById("Cards", cardId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  },
  Card: {
    searchFor: (card, args, { knexModule, logger }) => {
      return knexModule
        .getById("Tags", card.searchFor)
        .then(() => {
          logger.trace(
            `Get Tag with id: ${
              card.searchFor
            } from database for Card with id: ${card.id}.`
          );
        })
        .catch(error => {
          logger.error(error);
          throw error;
        });
    },
    postedBy: (card, args, { knexModule, logger }) => {
      return knexModule
        .getById("Users", card.postedBy)
        .then(() => {
          logger.trace(
            `Get User with id: ${
              card.postedBy
            } from database for Card with id: ${card.id}.`
          );
        })
        .catch(error => {
          logger.error(error);
          throw error;
        });
    }
  }
};
module.exports = cardResolvers;
