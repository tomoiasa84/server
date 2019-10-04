const userResolvers = {
  Query: {
    get_users: (
      root,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: get_users`);
          return knexModule.getAll("Users");
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    get_user: (
      root,
      { userId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(() => {
          return knexModule.getById("Users", userId);
        })
        .catch(error => {
          logger.debug(error);
          throw error;
        });
    }
  },

  User: {
    cardsConnections: (user, args, { knexModule }) => {
      return knexModule
        .knexRaw(
          `SELECT * FROM "Cards" WHERE "postedBy" in (SELECT "targetUser" FROM "Connections" WHERE "originUser"='${user.id}');`
        )
        .then(result => {
          return result;
        })
        .catch(error => {
          throw error;
        });
    },
    tags: (user, args, { knexModule }) => {
      return knexModule
        .get("UserTags", { user: user.id })
        .then(data => {
          console.log(data);
          return data;
        })
        .catch(error => {
          throw error;
        });
    },
    cards: (user, args, { knexModule }) => {
      return knexModule.get("Cards", { postedBy: user.id }).catch(error => {
        throw error;
      });
    },
    location: (user, args, { knexModule }) => {
      //Resolve Location relation
      return knexModule.getById("Locations", user.location).catch(error => {
        throw error;
      });
    },
    settings: (user, args, { knexModule }) => {
      return knexModule
        .get("UserSettings", { user: user.id })
        .then(settings => {
          console.log(settings);
          return settings;
        })
        .catch(error => {
          throw error;
        });
    },
    conversations: (user, args, { knexModule }) => {
      return knexModule.getCustom("Conversations", user.id).catch(error => {
        throw error;
      });
    },
    connections: (user, args, { knexModule }) => {
      //Find friends of current user
      return knexModule
        .knexRaw(`SELECT * FROM "Connections" WHERE "originUser"='${user.id}';`)
        .then(result => {
          return result;
        })
        .catch(error => {
          throw error;
        });
    },
    reviews: (user, args, { knexModule }) => {
      //Find friends of current user
      return knexModule.get("TagReviews", { user: user.id }).catch(error => {
        throw error;
      });
    }
  }
};

module.exports = userResolvers;
