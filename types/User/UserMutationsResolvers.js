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
      { knexModule, uuidv1, admin, verifyToken, tokenId, logger, phoneFormater }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          const number = phoneFormater(phoneNumber);
          phoneNumber = number.formatInternational();
          return knexModule
            .knexRaw(
              `select * from "Users" where "phoneNumber"='${phoneNumber}';`
            )
            .then(result => {
              if (result.length === 0) {
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
                    return Promise.all(
                      insertDefaults(knexModule, user.id)
                    ).then(defaults => {
                      return knexModule
                        .insert("UserSettings", defaults)
                        .then(() => {
                          return user;
                        });
                    });
                  });
              }
              return knexModule.updateById("Users", result[0]["id"], {
                firebaseId,
                name,
                location,
                phoneNumber,
                description,
                isActive: true
              });
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
            const number = phoneFormater(phoneElement);
            phoneElement = number.formatInternational();
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
      { knexModule, admin, verifyToken, tokenId, logger, fetch, phoneFormater }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User: ${res.uid} Operation: update_user with id ${userId}`
          );
          if (phoneNumber) {
            const number = phoneFormater(phoneNumber);
            phoneNumber = number.formatInternational();
          }
          return knexModule
            .updateById("Users", userId, {
              name,
              location,
              profileURL,
              phoneNumber,
              description,
              deviceToken,
              isActive
            })
            .then(userUpdated => {
              //Check if deviceToken has been updated by checking for null
              if (deviceToken) {
                //Getting all conversationIds from "Conversations"
                return knexModule
                  .knexRaw(
                    `SELECT "id" FROM "Conversations" WHERE '${userUpdated.id}' = "user1" or '${userUpdated.id}' = "user2";`
                  )
                  .then(convIds => {
                    //Calling the GET link to update user subscription to conversations
                    const convString = convIds.join(",");
                    return fetch(
                      `https://ps.pndsn.com/v1/push/sub-key/${process.env.SUBSCRIPTION_KEY}/devices/${deviceToken}?add=${convString}&type=gcm`
                    ).then(response => {
                      if (response.ok) console.log("Subscription success");
                      else console.log("Subscription bad");
                      return userUpdated;
                    });
                  });
              }
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
