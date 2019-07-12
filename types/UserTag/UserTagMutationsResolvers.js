const userTagMutationsResolvers = {
  Mutation: {
    create_userTag: (root, { userId, tagId }, { knexModule }) => {
      return knexModule
        .insert("UserTags", {
          user: userId,
          tag: tagId,
          default: false
        })
        .catch(error => {
          throw error;
        });
    },
    update_userTag: (root, { userTagId, defaultFlag }, { knexModule }) => {
      return knexModule
        .updateById("UserTags", userTagId, { default: defaultFlag })
        .catch(error => {
          throw error;
        });
    },
    delete_userTag: (root, { usertagId }, { knexModule }) => {
      return knexModule.deleteById("UserTags", usertagId).catch(error => {
        throw error;
      });
    }
  }
};
module.exports = userTagMutationsResolvers;
