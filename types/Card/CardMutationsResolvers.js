const moment = require("moment");

const cardMutationsResolver = {
  Mutation: {
    delete_card: (root, { cardId }, { knexModule, pubsub }) => {
      return knexModule.deleteById("Cards", cardId).catch(err => {
        return 0;
      });
    },
    update_card: (root, { cardId, tag, message }, { knexModule, pubsub }) => {
      return knexModule
        .updateById("Cards", cardId, {
          searchFor: tag,
          text: message
        })
        .catch(error => {
          throw error;
        });
    },
    create_card(root, { postedBy, searchFor, text }, { knexModule, pubsub }) {
      return knexModule
        .insert("Cards", {
          postedBy,
          searchFor,
          text,
          createdAt: `${moment()}`
        })
        .catch(error => {
          throw error;
        });
    }
  }
};
module.exports = cardMutationsResolver;
