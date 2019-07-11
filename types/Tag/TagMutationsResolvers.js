const cardMutationsResolver = {
  Mutation: {
    update_tag: (root, { tagId, name }, { knexModule }) => {
      return knexModule
        .updateById("Tags", tagId, {
          name
        })
        .catch(error => {
          throw error;
        });
    },
    delete_tag: (root, { tagId }, { knexModule }) => {
      return knexModule.deleteById("Tags", tagId).catch(error => {
        throw error;
      });
    },
    create_tag: (root, { name }, { knexModule }) => {
      return knexModule
        .insert("Tags", {
          name
        })
        .catch(error => {
          throw error;
        });
    }
  }
};
module.exports = cardMutationsResolver;
