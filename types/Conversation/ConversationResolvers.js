const conversationResolvers = {
  Query: {
    get_conversations: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: get_cards`);
          return knexModule.getAll("Cards");
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    get_conversation: (
      root,
      { conversationId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: get_card with id ${conversationId}`
          );
          return knexModule.getById("Conversations", conversationId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  },
  Conversation: {
    user1: (conversation, args, { knexModule, logger }) => {
      return knexModule
        .getById("Users", conversation.user1)
        .then(data => {
          logger.trace(
            `Get User with id: ${conversation.user1} from database for Card with id: ${conversation.id}.`
          );
          return data;
        })
        .catch(error => {
          logger.error(error);
          throw error;
        });
    },
    user2: (conversation, args, { knexModule, logger }) => {
      return knexModule
        .getById("Users", conversation.user2)
        .then(data => {
          logger.trace(
            `Get User with id: ${conversation.user2} from database for Card with id: ${conversation.id}.`
          );
          return data;
        })
        .catch(error => {
          logger.error(error);
          throw error;
        });
    }
  }
};
module.exports = conversationResolvers;
