const settingResolver = {
  Query: {
    get_settings: (root, args, { knexModule }) => {
      return knexModule.getAll("Settings");
    }
  }
};
module.exports = settingResolver;
