const recommandMutationsResolvers = {
  Mutation: {
    delete_recommand: (root, { recommandId }, { knexModule }) => {
      return knexModule
        .deleteById("Recommandations", recommandId)
        .catch(error => {
          throw error;
        });
    },
    update_recommand: (
      root,
      { recommandId, cardId, userAsk, userSend, userRec },
      { knex }
    ) => {
      return knexModule("Recommandations", recommandId, {
        cardId: cardId,
        userAsk: userAsk,
        userSend: userSend,
        userRecommand: userRec,
        acceptedFlag: false
      }).catch(error => {
        throw error;
      });
    },
    create_recommand: (
      root,
      { cardId, userAsk, userSend, userRec },
      { knexModule }
    ) => {
      return knexModule
        .insert("Recommandations", {
          card: cardId,
          userAsk: userAsk,
          userSend: userSend,
          userRecommand: userRec,
          acceptedFlag: false
        })
        .catch(error => {
          throw error;
        });
    }
  }
};

module.exports = recommandMutationsResolvers;
