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
      { firebaseId, name, location, phoneNumber, description },
      { knexModule, uuidv1, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          console.log(tokenId);

          logger.trace(`User: ${res.uid} Operation: create_user`);
          //check if phone number if exists
          return knexModule
            .insert("Users", {
              id: `${uuidv1()}`,
              firebaseId,
              name,
              location,
              phoneNumber,
              description,
              isActive: true
            })
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
    load_connections: (
      root,
      { existingUsers },
      { knexModule, uuidv1, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin).then(res => {
        if (existingUsers.length !== 0) {
          let promiseArray = [];
          existingUsers.forEach(phoneElement => {
            //should add default settings and default connection
            promiseArray.push(
              knexModule
                .get("Users", { phoneNumber: phoneElement })
                .then(contactUser => {
                  return knexModule
                    .get("Users", { firebaseId: res.uid })
                    .then(resultArray => {
                      return knexModule.insert("Connections", {
                        originUser: resultArray[0]["id"],
                        targetUser: contactUser[0]["id"]
                      });
                    });
                })
            );
          });
          return Promise.all(promiseArray).catch(error => {
            throw new Error("Could not create connections");
          });
        }
      });
    },
    load_contacts: (
      root,
      { phoneContacts },
      { knexModule, uuidv1, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin).then(res => {
        if (phoneContacts.length !== 0) {
          let promiseArray = [];
          phoneContacts.forEach(phoneElement => {
            //should add default settings and default connection
            promiseArray.push(
              knexModule
                .insert("Users", {
                  id: `${uuidv1()}`,
                  firebaseId: `${uuidv1()}`,
                  name: phoneElement,
                  phoneNumber: phoneElement,
                  isActive: false
                })
                .then(contactUser => {
                  return knexModule
                    .get("Users", { firebaseId: res.uid })
                    .then(restulArray => {
                      return knexModule.insert("Connections", {
                        originUser: restulArray[0]["id"],
                        targetUser: contactUser.id
                      });
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
      {
        userId,
        name,
        location,
        profileURL,
        phoneNumber,
        isActive,
        description,
        deviceToken
      },
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
            profileURL,
            phoneNumber,
            description,
            deviceToken,
            isActive
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
