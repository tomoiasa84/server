const locationMutationsResolver = {
  Mutation: {
    update_location: (root, { locationId }, { knexModule }) => {
      return knexModule.deleteById("Locations", locationId).catch(error => {
        throw error;
      });
    },
    update_location: (root, { locationId, city }, { knexModule }) => {
      return knexModule
        .updateById("Locations", locationId, {
          city: city
        })
        .catch(error => {
          throw error;
        });
    },
    create_location: (root, { city }, { knexModule }) => {
      return knexModule
        .insert("Locations", {
          city: city
        })
        .catch(error => {
          throw error;
        });
    }
  }
};
module.exports = locationMutationsResolver;
