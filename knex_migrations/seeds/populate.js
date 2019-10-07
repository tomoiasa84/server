const romCities = require("romanian-cities");
const fs = require("fs");
const faker = require("faker");
const moment = require("moment");
const uuidv1 = require("uuid/v1");
let tags = fs.readFileSync(
  "C:\\Users\\itudo\\Desktop\\server\\db\\finalList.json",
  "UTF-8"
);
let tagsArray = JSON.parse(tags);
let usersData = fs.readFileSync(
  "C:\\Users\\itudo\\Desktop\\server\\db\\output.json",
  "UTF-8"
);
let usersDataParsed = JSON.parse(usersData);

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
let counter = 0;
let tagIdDictionary = {};
let phoneNumberSet = new Set();
function createCompanyAccount(knex, name, phoneNumber, tagId) {
  if (!phoneNumberSet.has(phoneNumber)) {
    phoneNumberSet.add(phoneNumber);
    let userId = uuidv1();
    return knex("Users")
      .insert({
        id: `${userId}`,
        firebaseId: `${faker.random.uuid()}`,
        name,
        phoneNumber,
        isActive: false
      })
      .then(() => {
        return knex("UserTags").insert({
          user: userId,
          tag: tagId,
          default: true
        });
      });
  }
  return null;
}
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("Tags")
    .del()
    .then(() => {
      let tagsToInsert = [];
      tagsArray.forEach(tag => {
        tagsToInsert.push(
          knex("Tags")
            .insert({ name: tag })
            .returning("id")
            .then(tagId => {
              if (!tagIdDictionary[tag]) tagIdDictionary[tag] = tagId[0];
              return tagId;
            })
        );
      });
      return Promise.all(tagsToInsert);
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
      //Populate user table
      let users = [];
      // for (let i = 0; i < 3; i++) {
      //   users.push(createUser(knex, romCities.random().city));
      // }
      usersDataParsed.forEach(elem => {
        users.push(
          createCompanyAccount(
            knex,
            elem["Business Name"],
            elem["Contact Phone Number"],
            parseInt(tagIdDictionary[elem["Industry"]])
          )
        );
      });
      return Promise.all(users);
    });
};
