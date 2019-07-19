const recommandMutationsResolvers = {
  Mutation: {
    delete_recommand: (root, { recommandId }, { knexModule }) => {
      return knexModule.deleteById("Recommands", recommandId).catch(error => {
        throw error;
      });
    },
    update_recommand: (
      root,
      { recommandId, cardId, userAsk, userSend, userRec },
      { knexModule }
    ) => {
      return knexModule
        .updateById("Recommands", recommandId, {
          card: cardId,
          userAsk,
          userSend,
          userRecommand: userRec,
          acceptedFlag: false
        })
        .catch(error => {
          throw error;
        });
    },
    create_recommand: (
      root,
      { cardId, userAsk, userSend, userRec },
      { knexModule }
    ) => {
      return knexModule
        .insert("Recommands", {
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
