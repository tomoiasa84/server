const romCities = require("romanian-cities");
const faker = require("faker");
const moment = require("moment");
const tags = require("../../db/jobs");

function createUser(knex, location) {
  return knex("Locations")
    .where("city", location)
    .first()
    .then(locationRecord => {
      let userName = faker.name.findName();
      return knex("Users")
        .returning("id")
        .insert({
          id: `${faker.random.uuid()}`,
          firebaseId: `${faker.random.uuid()}`,
          name: userName,
          location: locationRecord.id,
          phoneNumber: `${faker.phone.phoneNumber()}`,
          isActive: true
        })
        .then(userIds => {
          //Set UserDefaultSettings
          let defaults = [];
          //Notification option
          defaults.push(
            knex("Settings")
              .where({
                name: "PushNotification",
                value: "true"
              })
              .first()
              .then(setting => {
                return {
                  setting: setting.id,
                  user: userIds[0]
                };
              })
          );
          //MsgNotifs
          defaults.push(
            knex("Settings")
              .where({
                name: "MessageNotification",
                value: "true"
              })
              .first()
              .then(setting => {
                return {
                  setting: setting.id,
                  user: userIds[0]
                };
              })
          );
          //Card notifs
          defaults.push(
            knex("Settings")
              .where({
                name: "CardNotification",
                value: "true"
              })
              .first()
              .then(setting => {
                return {
                  setting: setting.id,
                  user: userIds[0]
                };
              })
          );
          //Privacy
          defaults.push(
            knex("Settings")
              .where({
                name: "ProfilePrivacy",
                value: "Connections"
              })
              .first()
              .then(setting => {
                return {
                  setting: setting.id,
                  user: userIds[0]
                };
              })
          );

          return Promise.all(defaults).then(defaultsres => {
            return knex("UserSettings").insert(defaultsres);
          });
        });
    });
}

function createConnection(knex, rows) {
  return knex("Connections").insert({
    originUser: rows[0].id,
    targetUser: rows[1].id,
    confirmation: true,
    blockFlag: false
  });
}

function createCard(knex, user) {
  return knex
    .raw(
      `SELECT *
    FROM Tags
    ORDER BY random()
    LIMIT 1;`
    )
    .then(tagRec => {
      return knex("Cards").insert({
        postedBy: user.id,
        searchFor: tagRec.rows[0].id,
        createdAt: `${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
        message: `${faker.lorem.sentence()}`
      });
    });
}
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return (
    knex("Tags")
      .del()
      .then(() => {
        return knex("Locations").del();
      })
      .then(() => {
        let settings = [
          {
            name: "PushNotification",
            value: "true"
          },
          {
            name: "PushNotification",
            value: "false"
          },
          {
            name: "MessageNotification",
            value: "true"
          },
          {
            name: "MessageNotification",
            value: "false"
          },
          {
            name: "CardNotification",
            value: "true"
          },
          {
            name: "CardNotification",
            value: "false"
          },
          {
            name: "ProfilePrivacy",
            value: "Nobody"
          },
          {
            name: "ProfilePrivacy",
            value: "Connections"
          },
          {
            name: "ProfilePrivacy",
            value: "Anyone"
          }
        ];

        return knex("Settings").insert(settings);
      })
      .then(() => {
        //Using romanian-cities library to populate the location table
        let locationsArray = [];
        romCities.all.forEach(element => {
          locationsArray.push({
            city: element.city
          });
        });
        return knex("Locations").insert(locationsArray);
      })
      .then(() => {
        let tagsPromise = [];
        tags.forEach(tag => {
          tagsPromise.push(knex("Tags").insert({ name: tag }));
        });
        return Promise.all(tagsPromise);
      })
      // .then(() => {
      //   //Populate tag table
      //   let tagSet = new Set();
      //   while (tagSet.size < 100) {
      //     tagSet.add(faker.name.jobTitle());
      //   }
      //   tagSet.forEach(el => {
      //     tags.push({
      //       name: el
      //     });
      //   });
      //   return knex("Tags").insert(tags);
      // })
      .then(() => {
        //Populate user table
        let users = [];
        for (let i = 0; i < 3; i++) {
          users.push(createUser(knex, romCities.random().city));
        }
        return Promise.all(users);
      })
  );
};
