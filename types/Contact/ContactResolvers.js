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
        .then(checkedContacts => {
          if (checkedContacts.length === 0) return false;
          return true;
        });
    }
  }
};
//eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ2YzM5Mzc4YWVmYzA2YzQyYTJlODI1OTA0ZWNlZDMwODg2YTk5MjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY29udHJhY3RvcnNlYXJjaC1lZWFmNyIsImF1ZCI6ImNvbnRyYWN0b3JzZWFyY2gtZWVhZjciLCJhdXRoX3RpbWUiOjE1NzA2NTY4MTQsInVzZXJfaWQiOiJqemo4RTJ0QWJVUTdyNWFZYklWR0poQjJsTUIzIiwic3ViIjoianpqOEUydEFiVVE3cjVhWWJJVkdKaEIybE1CMyIsImlhdCI6MTU3MDY1NjgxNCwiZXhwIjoxNTcwNjYwNDE0LCJwaG9uZV9udW1iZXIiOiIrNDA3NDkzNTM2NTAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIis0MDc0OTM1MzY1MCJdfSwic2lnbl9pbl9wcm92aWRlciI6InBob25lIn19.Mgs2so6j2cPamS8BW8Hsxuj49aY4oStPxBnWNm2S2NUXc2WywX-zj8iM1smD1kjxkEs169HI1Di2InowQ1Yed45tI_Nz8ekqmJNjd79XrS8vNq1thU872BXsySdQM8gDiRhj2Rv98Y3rX3wJoZepn3Zj9Gzib000l4b4qTo0awsqbyPz3wULd3GCxmWGX2iPqIyrp-hLnpY5wbgAe6PTiMmAjuza9nZsubMFHZH5pBcbYwJhQB1Dgdp6mHv5uH0VEYhbmeX6QplnKjFifUX54kd2g1wr69Tn_cljH4ntuvmBsdAeMxUmqmVU59E4qJetiYILJvCMVJHF4gowjj13-Q
