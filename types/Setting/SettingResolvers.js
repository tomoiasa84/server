const settingResolver = {
    Query: {
      settings: (root,args,{ knex }) => {

        return knex('Settings').select()
      }
    }
  };
module.exports = settingResolver;