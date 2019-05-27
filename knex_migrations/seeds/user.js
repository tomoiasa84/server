
const userData = require('../seed_data/users.js');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('userx').del()
    .then(function () {
      // Inserts seed entries
      return knex('userx').insert(userData);
    });
};
