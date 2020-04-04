import * as firebase from "firebase";

var firebaseApp = firebase;
// var firebaseConfig = {
//   apiKey: "AIzaSyBe7un63vYHMjKzx9uPVF4dBnhyICjgVoA",
//   authDomain: "veertly.firebaseapp.com",
//   databaseURL: "https://veertly.firebaseio.com",
//   projectId: "veertly",
//   storageBucket: "",
//   messagingSenderId: "1054983135299",
//   appId: "1:1054983135299:web:4833a893c55e975c6d74f6"
// };

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
// Initialize Firebase
firebaseApp.initializeApp(firebaseConfig);
export default firebaseApp;
