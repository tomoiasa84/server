const uniqueString = require("unique-string");
const conversationMutationsResolvers = {
  Mutation: {
    delete_conversation: (
      root,
      { conversationId },
      { knexModule, pubsub, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_channel`);
          return knexModule.deleteById("Conversations", conversationId);
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    update_conversation: (
      root,
      { conversationId, user1, user2 },
      { knexModule, pubsub, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: update_channel`);
          return knexModule.updateById("Conversations", conversationId, {
            user1,
            user2
          });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    },
    create_conversation(
      root,
      { user1, user2 },
      { knexModule, pubsub, admin, verifyToken, tokenId, logger, fetch }
    ) {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(
            `User with firebaseId: ${res.uid} Operation: create_conversation`
          );
          return knexModule
            .knexRaw(
              `select * from "Conversations" where '${user1}' in (user1,user2) and '${user2}' in (user1,user2)`
            )
            .then(recordArray => {
              if (recordArray.length === 0) {
                return knexModule
                  .insert("Conversations", {
                    id: `${uniqueString()}`,
                    user1,
                    user2
                  })
                  .then(convRec => {
                    return knexModule
                      .knexRaw(
                        `select * from "Users" where "id" in ('${user1}','${user2}');`
                      )
                      .then(users => {
                        let subscriptionPromises = [];
                        users.forEach(user => {
                          subscriptionPromises.push(
                            fetch(
                              `https://ps.pndsn.com/v1/push/sub-key/${process.env.SUBSCRIPTION_KEY}/devices/${user.deviceToken}?add=${convRec.id}&type=gcm`
                            ).then(response => {
                              if (response.ok)
                                console.log("Subscription success");
                              else console.log("Subscription bad");
                            })
                          );
                        });
                        return Promise.all(subscriptionPromises).then(() => {
                          return convRec;
                        });
                      });
                  });
              }
              return recordArray[0];
            });
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  }
};
module.exports = conversationMutationsResolvers;
