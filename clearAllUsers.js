const admin = require("firebase-admin");
const serviceAccount = require("./db/adminkey");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://contractorsearch-eeaf7.firebaseio.com"
});
// async function listAllUsers(nextPageToken) {
//   // List batch of users, 1000 at a time.
//   await admin
//     .auth()
//     .listUsers(50, nextPageToken)
//     .then(function(listUsersResult) {
//       listUsersResult.users.forEach(async function(userRecord) {
//         await admin
//           .auth()
//           .deleteUser(userRecord.uid)
//           .then(function() {
//             console.log("Successfully deleted user");
//           })
//           .catch(function(error) {
//             console.log("Error deleting user:", error);
//           });
//       });
//       if (listUsersResult.pageToken) {
//         // List next batch of users.
//         listAllUsers(listUsersResult.pageToken);
//       }
//     })
//     .catch(function(error) {
//       console.log("Error listing users:", error);
//     });
// }
// // Start listing users from the beginning, 1000 at a time.
// listAllUsers();
admin
  .auth()
  .getUser(uid)
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully fetched user data:", userRecord.toJSON());
  })
  .catch(function(error) {
    console.log("Error fetching user data:", error);
  });
