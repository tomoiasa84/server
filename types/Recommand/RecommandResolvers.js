const recommandResolvers = {
  Query: {
    get_recommands: (root, args, { knexModule }) => {
      return knexModule.getAll("Recommands").catch(error => {
        throw error;
      });
    },
    get_recommand: (root, { recommandId }, { knexModule }) => {
      return knexModule.getById("Recommands", recommandId).catch(error => {
        throw error;
      });
    }
  },
  Recommand: {
    card: (parent, args, { knexModule }) => {
      return knexModule.getById("Cards", parent.card).catch(error => {
        throw error;
      });
    },
    userAsk: (parent, args, { knexModule }) => {
      return knexModule.getById("Users", parent.userAsk).catch(error => {
        throw error;
      });
    },
    userSend: (parent, args, { knexModule }) => {
      return knexModule.getById("Users", parent.userSend).catch(error => {
        throw error;
      });
    },
    userRecommand: (parent, args, { knexModule }) => {
      return knexModule.getById("Users", parent.userRecommand).catch(error => {
        throw error;
      });
    }
  }
};
module.exports = recommandResolvers;
