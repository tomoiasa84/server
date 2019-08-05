const threadMessageResolvers = {
  Query: {
    get_threadmessages: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.getAll("MessageThreads");
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    get_threadmessage: (
      root,
      { threadMessageId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.getById("MessageThreads", threadMessageId);
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  },
  ThreadMessage: {
    recommandCard: (threadMsg, args, { knexModule }) => {
      return knexModule
        .getById("Recommands", threadMsg.userrecomcard)
        .catch(error => {
          throw error;
        });
    },
    messages: (threadMsg, args, { knexModule }) => {
      return knexModule.getById("Messages", threadMsg.id).catch(error => {
        throw error;
      });
    },
    users: (threadMsg, args, { knexModule }) => {
      return knexModule
        .get("UserMessageThreads", {
          thread: threadMsg.id
        })
        .then(userThreadsRecords => {
          let users = [];
          if (userThreadsRecords.length) {
            userThreadsRecords.forEach(element => {
              users.push(knexModule.getById("Users", element.user));
            });
            return Promise.all(users);
          }
        })
        .catch(error => {
          throw error;
        });
    }
  }
};
module.exports = threadMessageResolvers;
