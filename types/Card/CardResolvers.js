const cardResolvers = {
  Query: {
    get_cards: (root, args, { knexModule }) => {
      return knexModule.getAll("Cards").catch(error => {
        throw error;
      });
    },
    get_card: (root, { cardId }, { knexModule }) => {
      return knexModule.getById("Cards", cardId).catch(error => {
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
