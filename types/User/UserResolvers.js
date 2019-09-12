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
    cards_feed: (user, args, { knexModule }) => {
      return knexModule
        .get("Connections", { originUser: user.id })
        .then(connections => {
          if (connections.length) {
            let cards = [];
            connections.forEach(conn => {
              cards.push(
                knexModule
                  .get("Cards", { postedBy: conn.targetUser })
                  .then(listCards => {
                    if (!listCards.length) {
                      throw new Error("No card for user");
                    }
                    return listCards[0];
                  })
              );
            });
            return Promise.all(cards);
          }
          return [];
        })
        .catch(error => {
          throw error;
        });
    },
    tags: (user, args, { knexModule }) => {
      return knexModule
        .get("UserTags", { user: user.id })
        .then(data => {
          let tags = [];
          if (data.length) {
            data.forEach(userTag => {
              tags.push(knexModule.getById("Tags", userTag.tag));
            });
          }
          return Promise.all(tags);
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
          let settingsList = [];
          settings.forEach(setting => {
            settingsList.push(
              knex("Settings")
                .where("id", setting.setting)
                .first()
            );
          });
          return Promise.all(settingsList);
        })
        .catch(error => {
          throw error;
        });
    },
    conversations: (user, args, { knexModule }) => {
      let userConversations = [];
      userConversations.push(
        knexModule.get("Conversations", { user1: user.id })
      );
      userConversations.push(
        knexModule.get("Conversations", { user2: user.id })
      );
      return Promise.all(userConversations.flat());
    },
    connections: (user, args, { knexModule }) => {
      //Find friends of current user
      return knexModule
        .get("Connections", { originUser: user.id })
        .then(connections => {
          if (connections.length) {
            let usersList = [];
            connections.forEach(conn => {
              usersList.push(knexModule.getById("Users", conn.targetUser));
            });
            return Promise.all(usersList);
          }
          return [];
        })
        .catch(error => {
          throw error;
        });
    }
  }
};

module.exports = userResolvers;
