const userResolvers = {
  Query: {
    get_users: (root, args, { knex, admin, idToken, knexModule }) => {
      // admin
      //   .auth()
      //   .verifyIdToken(idToken)
      //   .then(function(decodedToken) {
      //     let userId = decodedToken.uid;
      //   })
      //   .catch(function(error) {
      //     console.log(error.message);
      //   });
      return knexModule.getAll("Users");
    },
    get_user: (root, { userId }, { knex, knexModule }) => {
      return knexModule.getById("Users", userId).catch(error => {
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
                knexModule.get("Cards", { postedBy: conn.targetUser })
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
    thread_messages: (user, args, { knexModule }) => {
      return null;
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
      return knexModule
        .getById("Locations", user.location)
        .then(data => data[0])
        .catch(error => {
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
