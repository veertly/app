import firebase from "./firebaseApp";

export const conferenceExists = async (sessionId) => {
  let docRef = firebase
    .firestore()
    .collection("eventSessionsDetails")
    .doc(sessionId.toLowerCase());

  let docSnapshot = await docRef.get();
  return docSnapshot.exists;
};

export const userRegisteredEvent = (sessionId) => {
  //, userId, email) => {
  let storageKey = "/veertly/" + sessionId;
  if (localStorage && localStorage.getItem(storageKey)) {
    return true;
  }
  return false;

  // let db = firebase.firestore();
  // debugger;
  // if (userId) {
  //   let found = false;
  //   let snapshot = await db
  //     .collection("eventSessionsRegistrations")
  //     .doc(sessionId)
  //     .collection("registrations")
  //     .where("userId", "==", userId)
  //     .get();
  //   debugger;

  //   await snapshot.forEach((doc) => {
  //     debugger;

  //     found = true;
  //   });
  //   if (found) {
  //     debugger;

  //     return true;
  //   }

  // if (email) {
  //   let found = false;
  //   debugger;
  //   let snapshot = await db
  //     .collection("eventSessionsRegistrations")
  //     .doc(sessionId)
  //     .collection("registrations")
  //     .where("email", "==", email)
  //     .get();
  //   debugger;
  //   await snapshot.forEach((doc) => {
  //     debugger;
  //     found = true;
  //   });
  //   if (found) {
  //     debugger;

  //     return true;
  //   }
  // }

  // return false;
};

export const registerToEvent = async (eventSession, userId, userDetails) => {
  let sessionId = eventSession.id.toLowerCase();

  if (!conferenceExists(sessionId)) {
    throw new Error("Event doesn't exist...");
  }
  if (userRegisteredEvent(sessionId)) {
    //, userId, userDetails.email)) {
    throw new Error("You have already registered to this event.");
  }
  // if (userId || (userDetails.email && userDetails.email.trim() !== "")) {
  //   if (await userRegisteredEvent(sessionId, userId, userDetails.email)) {
  //     throw new Error("User is already registered");
  //   }
  // }

  let { title, originalSessionId, eventBeginDate } = eventSession;

  let db = firebase.firestore();

  let timestamp = new Date().getTime();
  await db
    .collection("eventSessionsRegistrations")
    .doc(sessionId)
    .collection("registrations")
    .doc("" + timestamp + "-" + userId)
    .set({
      ...userDetails,
      userId,
      registrationDate: firebase.firestore.FieldValue.serverTimestamp(),
      title,
      originalSessionId,
      eventBeginDate: eventBeginDate ? eventBeginDate : null
    });
  localStorage.setItem("/veertly/" + sessionId, true);
};

export const isUserRegisteredToEvent = async (sessionId, userId) => {
  let docRef = firebase
    .firestore()
    .collection("eventSessionsRegistrations")
    .doc(sessionId)
    .collection("registrations")
    .doc(userId);

  let docSnapshot = await docRef.get();
  return docSnapshot.exists;
};
