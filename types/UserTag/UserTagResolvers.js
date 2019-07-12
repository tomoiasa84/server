const userTagResolvers = {
  Query: {
    get_userTags: (root, args, { knexModule }) => {
      return knexModule.getAll("UserTags").catch(error => {
        throw error;
      });
    },
    get_userTag: (root, { userTagId }, { knexModule }) => {
      return knexModule.getById("UserTags", userTagId).catch(error => {
        throw error;
      });
    }
  },
  UserTag: {
    user: (userTag, args, { knexModule }) => {
      return knexModule.getById("Users", userTag.user).catch(error => {
        throw error;
      });
    },
    tag: (userTag, args, { knexModule }) => {
      return knexModule.getById("Tags", userTag.tag).catch(error => {
        throw error;
      });
    }
  }
};
module.exports = userTagResolvers;
