function insertDefaults(knexModule, userId) {
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
          user: userId
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
          user: userId
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
          user: userId
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
          user: userId
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
          //check if phone number if exists
          return knexModule
            .insert("Users", {
              id,
              name,
              location,
              phoneNumber,
              isActive: true
            })
            .then(user => {
              return Promise.all(insertDefaults(knexModule, id)).then(
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
    load_contacts: (
      root,
      { contactsList },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin).then(res => {
        if (contactsList.length !== 0) {
          let promiseArray = [];
          contactsList.forEach(phoneElement => {
            promiseArray.push(
              admin
                .auth()
                .createUser({
                  phoneNumber: `${phoneElement}`
                })
                .then(function(userRecord) {
                  return knexModule.insert("Users", {
                    id: userRecord.uid,
                    phoneNumber: userRecord.phoneNumber,
                    isActive: false
                  });
                })
                .catch(function(error) {
                  console.log("Error creating new user:", error);
                })
            );
          });
          return Promise.all(promiseArray).catch(error => {
            throw new Error("Could not create accounts for list of Contacts");
          });
        }
      });
    },
    update_user: (
      root,
      { userId, name, location, phoneNumber, isActive },
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
            phoneNumber,
            isActive
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
