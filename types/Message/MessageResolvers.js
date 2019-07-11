const messageResolvers = {
  Query: {
    get_message: (root, { msgId }, { knexModule }) => {
      return knexModule.getById("Messages", msgId).catch(error => {
        throw error;
      });
    },
    get_messages: (root, args, { knexModule }) => {
      return knexModule.getAll("Messages").catch(error => {
        throw error;
      });
    }
  },
  Message: {
    messageThread: (message, args, { knexModule }) => {
      return knexModule
        .getById("MessageThreads", message.messageThread)
        .catch(error => {
          throw error;
        });
    },
    from: (message, args, { knexModule }) => {
      return knexModule.getById("Users", message.from).catch(error => {
        throw error;
      });
    }
  }
};
module.exports = messageResolvers;
