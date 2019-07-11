const settingResolver = {
  Query: {
    settings: (root, args, { knexModule }) => {
      return knexModule.select("Settings");
    }
  }
};
module.exports = settingResolver;
