import firebase from "./firebaseApp";
// import uuidv1 from "uuid/v1";

export const registerToEvent = (eventId, userId) => {
  const currentTimestamp = new Date().getTime();

  let updateObj = {};
  updateObj[`participants.${userId}`] = {
    registerTimestamp: currentTimestamp
  };
  // console.log(updateObj);
  firebase
    .firestore()
    .collection("events")
    .doc(eventId)
    .update(updateObj);
  //TODO: Move action to the backend
};
