const connectionMutationsResolvers = {
  Mutation: {
    create_connection: (
      obj,
      { origin, target },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: create_user`);
          return knexModule
            .knexRaw(
              `SELECT COUNT(*) FROM "Connections" WHERE "originUser"='${origin}' and "targetUser"='${target}';`
            )
            .then(result => {
              console.log(result[0]["count"]);

              if (result[0]["count"] === "0") {
                return knexModule.insert("Connections", {
                  originUser: origin,
                  targetUser: target,
                  confirmation: false,
                  blockFlag: false
                });
              }
              return knexModule
                .get("Connections", {
                  originUser: origin,
                  targetUser: target
                })
                .then(result => {
                  return result[0];
                });
            });
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    },
    delete_connection: (
      root,
      { connectionId },
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          logger.trace(`User: ${res.uid} Operation: delete_connection`);
          return knexModule.deleteById("Connections", connectionId);
        })
        .catch(function(error) {
          logger.debug(error);
          throw error;
        });
    }
    // update_connection: (
    //   root,
    //   { connectionId },
    //   { knexModule, admin, verifyToken, tokenId, logger }
    // ) => {
    //   return verifyToken(tokenId, admin)
    //     .then(res => {
    //       logger.trace(`User: ${res.uid} Operation: update_connection`);
    //       return knexModule
    //         .updateById("Connections", connectionId, {
    //           acceptedFlag: true
    //         })
    //         .then(data => {
    //           return {
    //             status: "ok",
    //             message: "Updated successfully"
    //           };
    //         });
    //     })
    //     .catch(function(error) {
    //       logger.debug(error);
    //       throw error;
    //     });
    // },
  }
};
module.exports = connectionMutationsResolvers;
