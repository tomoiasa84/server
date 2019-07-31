const locationMutationsResolver = {
  Mutation: {
    delete_location: (
      root,
      { locationId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.deleteById("Locations", locationId);
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    update_location: (
      root,
      { locationId, city },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.updateById("Locations", locationId, {
            city: city
          });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    create_location: (
      root,
      { city },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.insert("Locations", {
            city: city
          });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  }
};
module.exports = locationMutationsResolver;
