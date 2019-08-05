function insertDefaults(knexModule, userIds) {
  let defaults = [];
  //Notification option
  defaults.push(
    knexModule
      .get("Settings", {
        name: "PushNotification",
        value: "true"
      })
      .then(setting => {
        return {
          setting: setting.id,
          user: userIds[0]
        };
      })
  );
  //MsgNotifs
  defaults.push(
    knexModule
      .get("Settings", {
        name: "MessageNotification",
        value: "true"
      })
      .then(setting => {
        return {
          setting: setting.id,
          user: userIds[0]
        };
      })
  );
  //Card notifs
  defaults.push(
    knexModule
      .get("Settings", {
        name: "CardNotification",
        value: "true"
      })
      .then(setting => {
        return {
          setting: setting.id,
          user: userIds[0]
        };
      })
  );
  //Privacy
  defaults.push(
    knexModule
      .get("Settings", {
        name: "ProfilePrivacy",
        value: "Connections"
      })
      .then(setting => {
        return {
          setting: setting.id,
          user: userIds[0]
        };
      })
  );
  return defaults;
}
const userMutationsResolvers = {
  Mutation: {
    delete_user: (
      root,
      { userId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: delete_user with id: ${userId}`
          );
          return knexModule.deleteById("Users", userId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    create_user: (
      root,
      { id, name, location, phoneNumber },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: create_user`);
          return knexModule
            .insert("Users", { id, name, location, phoneNumber })
            .then(user => {
              return Promise.all(insertDefaults(knexModule, user.id)).then(
                defaults => {
                  return knexModule
                    .insert("UserSettings", defaults)
                    .then(() => {
                      return user;
                    });
                }
              );
            });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    delete_connection: (
      root,
      { connectionId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_connection`);
          return knexModule.deleteById("Connections", connectionId);
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    update_connection: (
      root,
      { connectionId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: update_connection`);
          return knexModule
            .updateById("Connections", connectionId, {
              acceptedFlag: true
            })
            .then(data => {
              return {
                status: "ok",
                message: "Updated successfully"
              };
            });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    update_user: (
      root,
      { userId, name, location, phoneNumber },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: update_user with id ${userId}`
          );
          return knexModule.updateById("Users", userId, {
            name,
            location,
            phoneNumber
          });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    create_connection: (
      obj,
      { origin, target },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: create_user`);
          return knexModule
            .insert("Connections", {
              originUser: origin,
              targetUser: target,
              confirmation: false,
              blockFlag: false
            })
            .then(data => {
              return data.id;
            });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
  }
};
module.exports = userMutationsResolvers;
