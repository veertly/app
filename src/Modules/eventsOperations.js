import firebase from "./firebaseApp";
// import uuidv1 from "uuid/v1";

export const registerToEvent = async (sessionId, userId, userDetails) => {
  await firebase
    .firestore()
    .collection("eventSessionsRegistrations")
    .doc(sessionId)
    .collection("registrations")
    .doc(userId)
    .set({ ...userDetails, userId, registrationDate: firebase.firestore.FieldValue.serverTimestamp() });
};

export const conferenceExists = async (sessionId) => {
  let docRef = firebase.firestore().collection("eventSessions").doc(sessionId.toLowerCase());

  let docSnapshot = await docRef.get();
  return docSnapshot.exists;
};
