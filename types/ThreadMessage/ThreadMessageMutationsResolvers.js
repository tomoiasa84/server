const threadMessageMutationsResolvers = {
  Mutation: {
    delete_threadmessage: (root, { threadMessageId }, { knexModel }) => {
      return knexModel
        .deleteById("MessageThreads", threadMessageId)
        .catch(error => {
          throw error;
        });
    },
    update_threadmessage: (
      root,
      { threadMessageId, userRecomCard },
      { knexModel }
    ) => {
      return knexModel
        .updateById("MessageThreads", threadMessageId, {
          recommandation: userRecomCard
        })
        .catch(error => {
          throw error;
        });
    },
    //User that starts conversations generates first entry
    create_threadmessage: (
      root,
      {
        //Need 2 users to start conversation
        userRecomCard,
        originUserId,
        targetUserId
      },
      { knexModule }
    ) => {
      return knexModule
        .insert("MessageThreads", {
          recommandation: userRecomCard
        })
        .then(threadIds => {
          let promises = [];
          //create origin user thread
          promises.push(
            knexModule.insert("UserMessageThreads", {
              user: originUserId,
              thread: threadIds[0]
            })
          );
          //create target user thread
          promises.push(
            knexModule.insert("UserMessageThreads", {
              user: targetUserId,
              thread: threadIds[0]
            })
          );
          return Promise.all(promises).then(done => {
            return done.flat();
          });
        })
        .catch(error => {
          throw error;
        });
    }
  }
};
module.exports = threadMessageMutationsResolvers;
