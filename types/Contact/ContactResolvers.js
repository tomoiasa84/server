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
            let responseList = [];
            contactsList.forEach(contact => {
              responseList.push({ contact, currentUser: res.uid });
            });
            return responseList;
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
      return contact.contact;
    },
    exists: async (
      contact,
      args,
      { knexModule, admin, verifyToken, tokenId, logger }
    ) => {
      let checkedContacts = await knexModule.knexRaw(
        `select * from "Users" where "phoneNumber"='${contact}';`
      );
      if (checkedContacts.length === 0) {
        console.log("No connections");

        return false;
      } else {
        console.log("Connections");

        let user = await knexModule.get("Users", {
          firebaseId: contact.currentUser
        });
        console.log(JSON.stringify(user));

        let insert = await knexModule.insert("Connections", {
          origin: user[0]["id"],
          target: checkedContacts[0]["id"]
        });
        console.log(
          `Origin: ${user[0]["id"]}, Target: ${checkedContacts[0]["id"]}`
        );

        return true;
      }
    }
  }
};
