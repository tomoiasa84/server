module.exports = {
  Query: {
    check_contacts: (
      root,
      { contactsList },
      { admin, verifyToken, tokenId, logger }
    ) => {
      return verifyToken(tokenId, admin)
        .then(res => {
          if (contactsList.length !== 0) {
            return contactsList;
          } else {
            throw new Error("Empty conctacts list parameter");
          }
        })
        .catch(function(error) {
          logger.error(error);
          throw error;
        });
    }
  },
  Contact: {
    number: (contact, args, { admin, verifyToken, tokenId, logger }) => {
      return contact;
    },
    exists: (
      contact,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      return knexModule
        .knexRaw(`select * from "Users" where "phoneNumber"='${contact}';`)
        .then(checkedContact => {
          if (checkedContact.length === 0) return false;
          //should connect the users that already exists
          return true;
        });
    }
  }
};
