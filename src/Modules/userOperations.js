import firebase from "./firebaseApp";

export const registerNewUser = async user => {
  console.log("on: registerNewUser");
  let { displayName, email, phoneNumber, uid, photoURL, isAnonymous } = user;
  let names = displayName.split(" ");
  let firstName = names[0];
  let lastName = names.length > 1 ? names[names.length - 1] : "";
  firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .set({
      id: uid,
      displayName,
      avatarUrl: photoURL,
      email,
      phoneNumber,
      firstName,
      lastName,
      isAnonymous: isAnonymous
    });

  var userAuth = firebase.auth().currentUser;
  await userAuth.updateProfile({
    displayName
  });
};

export const getUserDb = async uid => {
  let userDoc = await firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .get();
  return await userDoc.data();
};

export const logout = async () => {
  window.analytics.track("Logged out");
  await firebase.auth().signOut();
};
