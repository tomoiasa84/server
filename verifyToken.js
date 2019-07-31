module.exports = (token, admin) => {
  return admin.auth().verifyIdToken(token);
};
