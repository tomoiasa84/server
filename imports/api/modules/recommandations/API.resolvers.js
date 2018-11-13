import { asyncIterator } from "apollo-live-server";

export default {
  Query: {
    recommandations(_, { filters, options }, { db }, ast) {
      $filters = filters
      $options = options
      const recommand = db.recommandations
        .astToQuery(ast, {
          $filters,
          $options
        })
        .fetch();
      return recommand;
    }
  },
  Mutation: {
    recommandationCreate(_, { data }, { db }) {
      data.createdAt = new Date();
      const commentIds = db.comments.insert({});
      const recommandationId = db.recommandations.insert({
        commentIds,
        ...data
      });
      return db.recommandations.findOne(recommandationId);
    },
    recommandationEdit(_, {recommandationId, data }, { db }) {
      db.recommandations.update(recommandationId, {
        $set: {...data}
      });
      return db.recommandations.findOne(recommandationId)
    },
    recommandationDelete(_, { recommandationId }, { db }) {
      return db.recommandations.remove(recommandationId);
    }
  },
  Subscription: {
    recommandations: {
      resolve: payload => {
        return payload;
      },
      subscribe(_, args, { db }, ast) {
        const observer = db.recommandations.find();
        return asyncIterator(observer);
      }
    }
  }
};
