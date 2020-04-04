import firebase from "./firebaseApp";

export const registerNewUser = async userAuth => {
  console.log("on: registerNewUser");
  let { displayName, email, phoneNumber, uid, photoURL, isAnonymous } = userAuth;
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

  var userAuth2 = firebase.auth().currentUser;
  await userAuth2.updateProfile({
    displayName
  });
};

export const updateUser = async (userId, sessionId, userDb) => {
  let db = firebase.firestore();

  let userRef = db.collection(`users`).doc(userId);
  let userSessionRef = null;
  let userAttendedEventsRef = null;

  let newUserAttendedEvents = {};
  let updateUserAttendedEvents = {};

  if (sessionId) {
    userSessionRef = db
      .collection(`eventSessions`)
      .doc(sessionId.toLowerCase())
      .collection("participantsDetails")
      .doc(userId);

    userAttendedEventsRef = db
      .collection(`userAttendedEvents`)
      .doc(userId)
      .collection("events")
      .doc(sessionId.toLowerCase());

    let eventSessionSnapshot = await firebase
      .firestore()
      .collection("eventSessionsDetails")
      .doc(sessionId.toLowerCase())
      .get();
    let eventSession = eventSessionSnapshot.data();

    const { title, originalSessionId, liveAt } = eventSession;
    newUserAttendedEvents = {
      joinedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      title,
      originalSessionId,
      liveAt
    };
    updateUserAttendedEvents = { originalSessionId };
  }

  let userSession = { ...userDb };
  if (!userDb.emailPublic) {
    userSession.email = null;
  }

  await db.runTransaction(async function(transaction) {
    let userSnapshot = await transaction.get(userRef);
    let userSessionSnapshot = userSessionRef ? await transaction.get(userSessionRef) : null;
    let userAttendedEventsSnapshot = userAttendedEventsRef ? await transaction.get(userAttendedEventsRef) : null;

    // console.log({ eventSession, minEventSession });
    if (!userSnapshot.exists) {
      transaction.set(userRef, userDb);
    } else {
      transaction.update(userRef, userDb);
    }
    if (sessionId) {
      if (!userSessionSnapshot.exists) {
        transaction.set(userSessionRef, userSession);
      } else {
        transaction.update(userSessionRef, userSession);
      }

      if (!userAttendedEventsSnapshot.exists) {
        transaction.set(userAttendedEventsRef, newUserAttendedEvents);
      } else {
        transaction.update(userAttendedEventsRef, updateUserAttendedEvents);
      }
    }
  });

  var userAuth = firebase.auth().currentUser;
  await userAuth.updateProfile({
    displayName: userDb.firstName + " " + userDb.lastName
  });
  // .then(function() {
  //   // console.log("Transaction successfully committed!");
  // })
  // .catch(function(error) {
  //   console.log("Transaction failed: ", error);
  //   // throw error;
  // });
};

export const getUserDb = async uid => {
  let userDoc = await firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .get();
  return await userDoc.data();
};

export const getUserSessionDb = async (sessionId, uid) => {
  let userDoc = await firebase
    .firestore()
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(uid)
    .get();
  return await userDoc.data();
};

export const hasUserSession = async (sessionId, userId) => {
  let docRef = firebase
    .firestore()
    .collection("eventSessions")
    .doc(sessionId.toLowerCase())
    .collection("participantsDetails")
    .doc(userId);

  let docSnapshot = await docRef.get();
  return docSnapshot.exists;
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
