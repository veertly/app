import firebase, { launchBroadcastMessageFirebaseFunction } from "./firebaseApp";

export const BROADCAST_MESSAGE_STATES = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ACTIVE: "active"
};

export const BROADCAST_MESSAGE_NAMESPACES = {
  GLOBAL: "global"
};

export const createBroadcastMessage  = async ({
  sessionId,
  userId,
  message,
  state = BROADCAST_MESSAGE_STATES.PUBLISHED,
  namespace = BROADCAST_MESSAGE_NAMESPACES.GLOBAL,
}) => {
  const db = firebase.firestore();

  const broadcastMessageId = String(new Date().getTime());

  const broadcastMessageToBeSaved = {
    id: broadcastMessageId,
    owner: userId,
    creationDate: firebase.firestore.FieldValue.serverTimestamp(),
    message,
    state,
  };
  try {
    await db
      .collection("eventSessions")
      .doc(sessionId.toLowerCase())
      .collection("broadcasts")
      .doc(namespace)
      .collection("broadcastsMessages")
      .doc(broadcastMessageId)
      .set(broadcastMessageToBeSaved);
  } catch (error) {
    console.log(error);
  }
};

export const updateBroadcastMessage = async ({
  sessionId,
  userId,
  originalBroadcast,
  newMessage,
  newState=BROADCAST_MESSAGE_STATES.PUBLISHED,
  namespace = BROADCAST_MESSAGE_NAMESPACES.GLOBAL
}) => {
  const broadcastMessageId = originalBroadcast.id;

  let db = firebase.firestore();
  if (!originalBroadcast) {
    throw new Error("Original broadcast message is not defined");
  };

  let broadcastToBeSaved = {
    id: broadcastMessageId,
    owner: userId,
    creationDate: firebase.firestore.FieldValue.serverTimestamp(),
    message: newMessage,
    state: newState,
  };

  const batch = db.batch();

  const broadcastRef = db
    .collection("eventSessions")
    .doc(sessionId.toLowerCase())
    .collection("broadcasts")
    .doc(namespace)
    .collection("broadcastsMessages")
    .doc(`${broadcastMessageId}`);

  batch.update(broadcastRef, broadcastToBeSaved);
  
  await batch.commit();
};

// export const setBroadcastState = async ({
//   sessionId,
//   userId,
//   originalBroadcast,
//   newState,
//   namespace = BROADCAST_MESSAGE_NAMESPACES.GLOBAL
// }) => {
//   updateBroadcastMessage({
//     sessionId,
//     userId,
//     originalBroadcast,
//     newMessage: originalBroadcast.message,
//     newState,
//     namespace
//   });
// };

export const launchBroadcastMessage = async ({
  sessionId,
  userId,
  message,
  namespace = BROADCAST_MESSAGE_NAMESPACES.GLOBAL,
}) => {
  try {
    await launchBroadcastMessageFirebaseFunction({
      sessionId,
      userId,
      message,
      state: BROADCAST_MESSAGE_STATES.ACTIVE,
      namespace
    });  
  } catch (err) {
    console.log(err);
  }
}

export const deleteBroadcastMessage = async ({
  sessionId,
  broadcastMessageId,
  namespace=BROADCAST_MESSAGE_NAMESPACES.GLOBAL,
}) => {
  const db = firebase.firestore();

  const broadcastRef = db
    .collection("eventSessions")
    .doc(sessionId.toLowerCase())
    .collection("broadcasts")
    .doc(namespace)
    .collection("broadcastsMessages")
    .doc(`${broadcastMessageId}`);

  await broadcastRef.delete();
};
