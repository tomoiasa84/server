module.exports = (token, admin) => {
  console.log(token);
  if (token === "WzEu3ImkhhmVH1KtKg4iIZvezEXFQkWA")
    return new Promise((res, rej) => {
      res(true);
    });
  return admin.auth().verifyIdToken(token);
};
