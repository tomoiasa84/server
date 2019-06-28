function insertDefaults(knex,userIds){
    let defaults = [];
          //Notification option
          defaults.push(
            knex('Settings').where({
              name: 'PushNotification',
              value: 'true'
            }).first()
            .then(setting => {
              return {
                setting: setting.id,
                user: userIds[0]
              }
            })
          );
          //MsgNotifs
          defaults.push(
            knex('Settings').where({
              name: 'MessageNotification',
              value: 'true'
            }).first()
            .then(setting => {
              return {
                setting: setting.id,
                user: userIds[0]
              }
            })
          );
          //Card notifs
          defaults.push(
            knex('Settings').where({
              name: 'CardNotification',
              value: 'true'
            }).first()
            .then(setting => {
              return {
                setting: setting.id,
                user: userIds[0]
              }
            })
          );
          //Privacy
          defaults.push(
            knex('Settings').where({
              name: 'ProfilePrivacy',
              value: 'Connections'
            }).first()
            .then(setting => {
              return {
                setting: setting.id,
                user: userIds[0]
              }
            })
          );
          return defaults;
}
const userMutationsResolvers = {
    Mutation: {
        delete_user: (root, {
            userId
        }, {
            knex
        }) => {

            return knex('Users').where('id', userId)
                .first()
                .del()
                .then((data) => {

                    if (data) return userId;
                    return 0;
                })
                .catch((err) => {

                    return 0;
                })
        },
        create_user: (root, {
            name,
            cityId,
            phone
        }, {
            knex
        }) => {

            return knex.insert({
                    name: name,
                    location: cityId,
                    phoneNumber: phone,
                    isActive: true,
                })
                .returning('id')
                .into('Users')
                .then((userIds) => {

                    return Promise.all(insertDefaults(knex,userIds))
                    .then(defaultsres => {

                        return knex('UserSettings').insert(defaultsres)
                        .then(() => {
                        
                            return knex('Users').where({
                                id: userIds[0]
                            }).first();
                        })
                    })
                })
                .catch((err) => {

                    console.log(err);
                    return {
                        id: 0
                    }
                })
        },
        delete_connection: (root, {
            idUser
        }, {
            knex
        }) => {
            return knex('Connections').where({
                    userTarget: idUser,
                    acceptedFlag: false
                })
                .del()
                .then((data) => {

                    if (data) {

                        return {
                            status: 'ok',
                            message: 'User deleted'
                        }
                    }
                    return {
                        status: 'bad',
                        message: 'User already deleted'
                    }

                })
                .catch((err) => {
                    return {
                        status: 'bad',
                        message: 'Error:cannot delete user'
                    }
                })
        },
        update_connection: (root, {
            idUser
        }, {
            knex
        }) => {

            return knex('Connections').where('targetUser', idUser)
                .update({
                    acceptedFlag: true
                })
                .then((data) => {
                    console.log(data);
                    return {
                        status: 'ok',
                        message: 'Updated successfully'
                    }
                })
                .catch((err) => {

                    return {
                        status: 'bad',
                        message: 'Error, cannot update connection'
                    }
                });
        },
        update_user: (root, {
            userId,
            name,
            location,
            phone
        }, {
            knex
        }) => {

            return knex('Users').where('id', userId).update({
                    name: name,
                    location: location,
                    phone: phone
                })
                .then((data) => {

                    return knex('Users').where('id', userId).first();
                })
                .catch((err) => {

                    console.log(err);
                    return {
                        id: 0
                    }
                })
        },
        create_connection: (obj, {
            origin,
            target
        }, {
            knex
        }) => {

            return knex('Connections').insert({
                    originUser: origin,
                    targetUser: target,
                    confirmation: false,
                    blockFlag: false
                })
                .then((data) => {
                    //console.log(data);
                    return {
                        status: 'ok',
                        message: 'Insert successfully.'
                    }
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        status: 'bad',
                        message: 'Error at insert'
                    }
                })
        }
    },
}
module.exports = userMutationsResolvers;