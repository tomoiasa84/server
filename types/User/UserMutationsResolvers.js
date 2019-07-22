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
    delete_user: (root, { userId }, { knexModule }) => {
      return knexModule.deleteById("Users", userId).catch(error => {
        throw error;
      });
    },
    create_user: (
      root,
      { id, name, location, phoneNumber },
      { knexModule }
    ) => {
      return knexModule
        .insert("Users", { id, name, location, phoneNumber })
        .then(user => {
          return Promise.all(insertDefaults(knexModule, user.id)).then(
            defaults => {
              return knexModule.insert("UserSettings", defaults).then(() => {
                return user;
              });
            }
          );
        })
        .catch(error => {
          throw error;
        });
    },
    delete_connection: (root, { connectionId }, { knexModule }) => {
      return knexModule.deleteById("Connections", connectionId).catch(error => {
        throw error;
      });
    },
    update_connection: (root, { connectionId }, { knexModule }) => {
      return knexModule
        .updateById("Connections", connectionId, {
          acceptedFlag: true
        })
        .then(data => {
          return {
            status: "ok",
            message: "Updated successfully"
          };
        })
        .catch(error => {
          throw error;
        });
    },
    update_user: (
      root,
      { userId, name, location, phoneNumber },
      { knexModule }
    ) => {
      return knexModule
        .updateById("Users", userId, { name, location, phoneNumber })
        .catch(error => {
          throw error;
        });
    },
    create_connection: (obj, { origin, target }, { knexModule }) => {
      return knexModule
        .insert("Connections", {
          originUser: origin,
          targetUser: target,
          confirmation: false,
          blockFlag: false
        })
        .then(data => {
          return data.id;
        })
        .catch(error => {
          throw error;
        });
    }
  }
};
module.exports = userMutationsResolvers;
