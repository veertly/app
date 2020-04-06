import firebase from "./firebaseApp";

export const uploadEventBanner = async (sessionId, bannerblob, userId) => {
  var storageRef = firebase.storage().ref();
  var bannerImageRef = storageRef.child(`eventSession/${sessionId}/${userId}/banner-${new Date().getTime()}.jpg`);
  bannerImageRef.put(bannerblob).then(function (snapshot) {
    console.log("Uploaded a blob or file!");
  });
  return bannerImageRef.fullPath;
};
