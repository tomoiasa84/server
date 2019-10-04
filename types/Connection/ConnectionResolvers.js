const connectionResolvers = {
  Query: {
    get_connections: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: get_connections`);
          return knexModule.getAll("Connections");
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    get_connection: (
      root,
      { connectionId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: get_connec`);
          return knexModule.getById("Connections", connectionId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  },
  Connection: {
    originUser: (connection, args, { knexModule, logger }) => {
      logger.trace(
        `Get User with id: ${connection.originUser} from database for Connections with id: ${connection.id}.`
      );
      return knexModule.getById("Users", connection.originUser).catch(error => {
        logger.error(error);
        throw error;
      });
    },
    targetUser: (connection, args, { knexModule, logger }) => {
      logger.trace(
        `Get User with id: ${connection.originUser} from database for Connections with id: ${connection.id}.`
      );
      return knexModule.getById("Users", connection.targetUser).catch(error => {
        logger.error(error);
        throw error;
      });
    }
  }
};
module.exports = connectionResolvers;
