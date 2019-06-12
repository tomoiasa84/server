const knex = require('../../db/pgAdaptop');
const privacyResolver = {
    Query: {
      privacies: () => {

        return knex('privacy').select()
      }
    }
  };
module.exports = privacyResolver;