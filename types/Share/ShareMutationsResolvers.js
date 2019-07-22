module.exports = {
  Mutation: {
    delete_share: (root, { shareIds }, { knexModule }) => {
      let promisesArray = [];
      if (shareIds.length) {
        shareIds.forEach(id => {
          promisesArray.push(knexModule.deleteById("Shares", id));
        });
      }
      return Promise.all(promisesArray).catch(error => {
        throw error;
      });
    },
    create_share: (
      root,
      { cardId, sharedBy, sharedTo },
      { knexModule, pubsub }
    ) => {
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
            throw error;
          });
      }
      return [];
    }
  }
};
