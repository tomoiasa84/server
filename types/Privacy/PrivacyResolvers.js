const privacyResolver = {
    Query: {
      privacies: (root,args,{ knex }) => {

        return knex('privacy').select()
      }
    }
  };
module.exports = privacyResolver;