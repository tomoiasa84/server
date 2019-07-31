const settingResolver = {
  Query: {
    get_settings: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.getAll("Settings");
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  }
};
module.exports = settingResolver;
