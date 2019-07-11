const moment = require("moment");

const cardMutationsResolver = {
  Mutation: {
    delete_sharecard: (root, { sharecardId }, { knexModule }) => {
      return knexModule.deleteById("Shares", sharecardId).catch(err => {
        return 0;
      });
    },
    create_sharecard: (root, { cardId, userIds }, { knexModule, pubsub }) => {
      if (userIds.length) {
        let promisesAwait = [];
        userIds.forEach(userId => {
          promisesAwait.push(
            //Insert into sharecard
            knexModule
              .insert("Shares", {
                card: cardId,
                sharedBy: userId
              })
              .then(share => {
                return share.id;
              })
          );
        });
        return Promise.all(promisesAwait)
          .then(shareIds => {
            return shareIds;
          })
          .catch(error => {
            throw error;
          });
      }
      return [];
    },
    delete_card: (root, { cardId }, { knexModule, pubsub }) => {
      return knexModule.deleteById("Cards", cardId).catch(err => {
        return 0;
      });
    },
    update_card: (root, { cardId, tag, message }, { knexModule, pubsub }) => {
      return knexModule
        .updateById("Cards", cardId, {
          searchFor: tag,
          message: message
        })
        .catch(error => {
          throw error;
        });
    },
    create_card(root, { postedBy, searchFor, text }, { knexModule, pubsub }) {
      return knexModule
        .insert({
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
