const connectionResolvers = {
  Query: {},
  Connection: {
    originUser: (connection, args, { knexModule, logger }) => {
      logger.trace(
        `Get User with id: ${connection.originUser} from database for Connections with id: ${conversation.id}.`
      );
      return knexModule
        .getById("Users", conversation.originUser)
        .catch(error => {
          logger.error(error);
          throw error;
        });
    },
    targetUser: (connection, args, { knexModule, logger }) => {
      logger.trace(
        `Get User with id: ${connection.originUser} from database for Connections with id: ${conversation.id}.`
      );
      return knexModule
        .getById("Users", conversation.targetUser)
        .catch(error => {
          logger.error(error);
          throw error;
        });
    }
  }
};
module.exports = connectionResolvers;
