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

export const logout = async sessionId => {
  window.analytics.track("Logged out");
  if (sessionId) {
    var userId = firebase.auth().currentUser.uid;

    var userStatusDatabaseRef = firebase.database().ref("/sessionUsersStatus/" + sessionId + "/" + userId);
    var userStatusFirestoreRef = firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsJoined")
      .doc(userId);

    var isOfflineForDatabase = {
      isOnline: false,
      leftTimestamp: firebase.database.ServerValue.TIMESTAMP,
      lastChanged: firebase.database.ServerValue.TIMESTAMP
    };

    var isOfflineForFirestore = {
      isOnline: false,
      leftTimestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    await userStatusDatabaseRef.update(isOfflineForDatabase);
    await userStatusFirestoreRef.update(isOfflineForFirestore);
  }
  await firebase.auth().signOut();
};

export const initFirebasePresenceSync = async (sessionId, userId) => {
  // https://firebase.google.com/docs/firestore/solutions/presence

  var userStatusDatabaseRef = firebase.database().ref("/sessionUsersStatus/" + sessionId + "/" + userId);
  var userStatusFirestoreRef = firebase
    .firestore()
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(userId);

  var isOfflineForDatabase = {
    isOnline: false,
    leftTimestamp: firebase.database.ServerValue.TIMESTAMP,
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  };

  var isOnlineForDatabase = {
    isOnline: true,
    joinedTimestamp: firebase.database.ServerValue.TIMESTAMP,
    leftTimestamp: null,
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  };

  var isOfflineForFirestore = {
    isOnline: false,
    leftTimestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  var isOnlineForFirestore = {
    isOnline: true,
    joinedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    leftTimestamp: null
  };

  firebase
    .database()
    .ref(".info/connected")
    .on("value", function(snapshot) {
      if (snapshot.val() === false) {
        userStatusFirestoreRef.update(isOfflineForFirestore);
        return;
      }

      userStatusDatabaseRef
        .onDisconnect()
        .update(isOfflineForDatabase)
        .then(function() {
          userStatusDatabaseRef.set(isOnlineForDatabase);
          userStatusFirestoreRef.update(isOnlineForFirestore);
        });
    });
};
