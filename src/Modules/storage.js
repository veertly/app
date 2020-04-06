import firebase from "./firebaseApp";

export const uploadEventBanner = async (sessionId, bannerblob) => {
  var storageRef = firebase.storage().ref();
  var bannerImageRef = storageRef.child(`eventSession/${sessionId}/banner.jpg`);
  bannerImageRef.put(bannerblob).then(function (snapshot) {
    console.log("Uploaded a blob or file!");
  });
  return bannerImageRef.fullPath;
};
