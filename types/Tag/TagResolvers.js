const tagResolvers = {
  Query: {
    get_tags: (root, args, { knexModule }) => {
      return knexModule.getAll("Tags").catch(error => {
        throw error;
      });
    },
    get_tag: (root, { tagId }, { knexModule }) => {
      return knexModule.getById("Tags", tagId).catch(error => {
        throw error;
      });
    }
  }
};
module.exports = tagResolvers;
