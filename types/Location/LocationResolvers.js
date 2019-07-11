const locationResolvers = {
  Query: {
    get_location: (root, { locationId }, { knexModule }) => {
      return knexModule.getById("Locations", locationId).catch(error => {
        throw error;
      });
    },
    get_locations: (root, args, { knexModule }) => {
      return knexModule.getAll("Locations").catch(error => {
        throw error;
      });
    }
  }
};
module.exports = locationResolvers;
