const messageMutationsResolvers = {
  Mutation: {
    delete_message: (root, { messageId }, { knexModule }) => {
      return knexModule.deleteById("Messages", messageId).catch(error => {
        throw error;
      });
    },
    update_message: (
      root,
      { messageId, text, msgThread, msgFrom },
      { knexModule }
    ) => {
      return knexModule
        .updateById("Messages", messageId, {
          text: text,
          messageThread: msgThread,
          from: msgFrom
        })
        .catch(error => {
          throw error;
        });
    },
    create_message: (root, { text, msgThread, msgFrom }, { knexModule }) => {
      return knexModule
        .insert("Messages", {
          text: text,
          messageThread: msgThread,
          from: msgFrom
        })
        .catch(error => {
          throw error;
        });
    }
  }
};
module.exports = messageMutationsResolvers;
