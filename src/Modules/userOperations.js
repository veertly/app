import firebase from "./firebaseApp";
import { trackEvent } from "./analytics";
import { leaveCall } from "./eventSessionOperations";

export const registerNewUser = async (userAuth) => {
  // console.log("on: registerNewUser");
  let {
    displayName,
    email,
    phoneNumber,
    uid,
    photoURL,
    isAnonymous
  } = userAuth;
  let names = displayName ? displayName.split(" ") : [""];
  let firstName = names[0];
  let lastName = names.length > 1 ? names[names.length - 1] : "";
  const userDb = {
    id: uid,
    displayName,
    avatarUrl: photoURL,
    email,
    phoneNumber,
    firstName,
    lastName,
    isAnonymous,
    linkedin: "",
    twitter: "",
    keybase: "",
    emailPublic: false,
    interest: "",
    twitterUrl: null,
    linkedinUrl: null,
    interestsChips: [],
    company: "",
    companyTitle: "",
    checkedTerms: false,
    checkedNewsletter: false,
    location: "",
    locationDetails: null
  };

  firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .set(userDb, { merge: true });

  var userAuth2 = firebase.auth().currentUser;
  await userAuth2.updateProfile({
    displayName
  });
  return userDb;
};

export const updateUser = async (userId, sessionId, userDb) => {
  let db = firebase.firestore();

  let userRef = db.collection("users").doc(userId);
  let userSessionRef = null;
  let userAttendedEventsRef = null;

  let newUserAttendedEvents = {};
  let updateUserAttendedEvents = {};

  if (sessionId) {
    userSessionRef = db
      .collection("eventSessions")
      .doc(sessionId.toLowerCase())
      .collection("participantsDetails")
      .doc(userId);

    userAttendedEventsRef = db
      .collection("userAttendedEvents")
      .doc(userId)
      .collection("events")
      .doc(sessionId.toLowerCase());

    let eventSessionSnapshot = await firebase
      .firestore()
      .collection("eventSessionsDetails")
      .doc(sessionId.toLowerCase())
      .get();
    let eventSession = eventSessionSnapshot.data();

    const { title, originalSessionId, eventBeginDate } = eventSession;
    newUserAttendedEvents = {
      joinedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      title,
      originalSessionId,
      eventBeginDate: eventBeginDate ? eventBeginDate : null
    };
    updateUserAttendedEvents = { originalSessionId };
  }

  let userSession = { ...userDb };
  if (!userDb.emailPublic) {
    userSession.email = null;
  }

  await db.runTransaction(async function (transaction) {
    let userSnapshot = await transaction.get(userRef);
    let userSessionSnapshot = userSessionRef
      ? await transaction.get(userSessionRef)
      : null;
    let userAttendedEventsSnapshot = userAttendedEventsRef
      ? await transaction.get(userAttendedEventsRef)
      : null;

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

export const getUserDb = async (uid) => {
  let userDoc = await firebase.firestore().collection("users").doc(uid).get();
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

export const setUserCurrentLocation = async (sessionId, currentLocation) => {
  if (sessionId) {
    var userId = firebase.auth().currentUser.uid;

    var userSessionRef = firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsJoined")
      .doc(userId);

    await userSessionRef.update({ currentLocation });
  }
};

export const setUserAvailableForCall = async (sessionId, availableForCall) => {
  if (sessionId) {
    var userId = firebase.auth().currentUser.uid;

    var userSessionRef = firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsJoined")
      .doc(userId);

    await userSessionRef.update({ availableForCall });
  }
};

export const setOffline = async (sessionId, userGroup) => {
  if (sessionId) {
    var userId = firebase.auth().currentUser.uid;

    var userStatusDatabaseRef = firebase
      .database()
      .ref("/sessionUsersStatus/" + sessionId + "/" + userId);
    var userStatusFirestoreRef = firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsJoined")
      .doc(userId);

    if (userGroup) {
      await leaveCall(sessionId, userGroup, userId);
    }

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
};
export const logoutDb = async (sessionId, userGroup) => {
  trackEvent("Logged out");
  await setOffline(sessionId, userGroup);
  // await firebase.auth().signOut();
};

export const initFirebasePresenceSync = async (
  sessionId,
  userId,
  participantsJoined
) => {
  // https://firebase.google.com/docs/firestore/solutions/presence

  var userStatusDatabaseRef = firebase
    .database()
    .ref("/sessionUsersStatus/" + sessionId + "/" + userId);
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

  firebase
    .database()
    .ref(".info/connected")
    .on("value", function (snapshot) {
      if (snapshot.val() === false) {
        userStatusFirestoreRef.set(isOfflineForFirestore, { merge: true });
        return;
      }

      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(function () {
          userStatusDatabaseRef.set(isOnlineForDatabase);

          if (!participantsJoined[userId]) {
            userStatusFirestoreRef.set(
              {
                groupId: null,
                isOnline: true,
                joinedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
                leftTimestamp: null,
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
              },
              { merge: true }
            );
          } else {
            userStatusFirestoreRef.update({
              isOnline: true,
              leftTimestamp: null,
              lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            });
          }
        });
    });
};

export const keepAlive = async (sessionId, userId, userSession) => {
  // console.log("Keep alive sent!");
  var keepAliveSessionRef = firebase
    .firestore()
    .collection("eventSessions")
    .doc(sessionId)
    .collection("keepAlive")
    .doc(userId);

  await keepAliveSessionRef.set(
    {
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  if (userSession && !userSession.isOnline) {
    var userSessionRef = firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsJoined")
      .doc(userId);

    await userSessionRef.set(
      {
        isOnline: true,
        leftTimestamp: null,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  }
};
