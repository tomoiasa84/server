module.exports = {
  Query: {
    get_shares: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_user`);
          return knexModule.getAll("Shares");
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  },
  Share: {
    card: (share, arg, { knexModule }) => {
      return knexModule.getById("Cards", share.card).catch(error => {
        throw error;
      });
    },
    sharedBy: (share, arg, { knexModule }) => {
      return knexModule.getById("Users", share.sharedBy).catch(error => {
        throw error;
      });
    },
    sharedTo: (share, arg, { knexModule }) => {
      return knexModule.getById("Users", share.sharedTo).catch(error => {
        throw error;
      });
    }
  }
};
