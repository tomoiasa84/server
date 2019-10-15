// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
var firebaseConfig = {
  apiKey: "AIzaSyC0kRZCXNmSwc6AnTA8RLIcxILhiaIy1Po",
  authDomain: "hello-world-997df.firebaseapp.com",
  databaseURL: "https://hello-world-997df.firebaseio.com",
  projectId: "hello-world-997df",
  storageBucket: "hello-world-997df.appspot.com",
  messagingSenderId: "739465086298",
  appId: "1:739465086298:web:ea9fbcaf92e2fd992cdf63"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
