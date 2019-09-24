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
      logger.trace(
        `Get Tag with id: ${card.searchFor} from database for Card with id: ${card.id}.`
      );
      return knexModule.getById("Tags", card.searchFor).catch(error => {
        logger.error(error);
        throw error;
      });
    },
    recommands: (card, args, { knexModule, logger }) => {
      logger.trace(
        `Get User with id: ${card.postedBy} from database for Card with id: ${card.id}.`
      );
      return knexModule
        .knexRaw(`SELECT COUNT(*) FROM "Recommands" WHERE "card"='${card.id}'`)
        .then(result => {
          console.log(result);

          return result[0]["count"];
        })
        .catch(error => {
          logger.error(error);
          throw error;
        });
    },
    postedBy: (card, args, { knexModule, logger }) => {
      logger.trace(
        `Get User with id: ${card.postedBy} from database for Card with id: ${card.id}.`
      );
      return knexModule
        .getById("Users", card.postedBy)

        .catch(error => {
          logger.error(error);
          throw error;
        });
    }
  }
};
module.exports = cardResolvers;
