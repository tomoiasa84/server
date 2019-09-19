const locationResolvers = {
  Query: {
    get_location: (
      root,
      { locationId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      if (tokenId === "") {
        logger.trace(`User: operation: get_location with id: ${locationId}`);
        return knexModule.getById("Locations", locationId);
      }
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: get_location with id: ${locationId}`
          );
          return knexModule.getById("Locations", locationId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    get_locations: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      if (tokenId === "") {
        logger.trace(`User: operation: get_locations`);
        return knexModule.getAll("Locations");
      }
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: get_locations`);
          return knexModule.getAll("Locations");
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  }
};
module.exports = locationResolvers;
