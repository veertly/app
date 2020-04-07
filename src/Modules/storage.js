import firebase from "./firebaseApp";

export const uploadEventBanner = async (sessionId, bannerblob, userId) => {
  var storageRef = firebase.storage().ref();
  var bannerImageRef = storageRef.child(`eventSession/${sessionId}/${userId}/banner-${new Date().getTime()}.jpg`);
  await bannerImageRef.put(bannerblob);
  let url = await bannerImageRef.getDownloadURL();
  return { path: bannerImageRef.fullPath, url };
};
