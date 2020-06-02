import firebase from "./firebaseApp";

export const sendChatMessage = async (
  sessionId,
  userId,
  namespace,
  messageId,
  message
) => {
  let db = firebase.firestore();
  let messageDb = {
    userId,
    sentDate: firebase.firestore.FieldValue.serverTimestamp(),
    messageId,
    message,
    status: "SENT"
  };
  // console.log({ messageDb });
  await db
    .collection("eventSessionsChatMessages")
    .doc(sessionId.toLowerCase())
    .collection(namespace)
    .doc(messageId)
    .set(messageDb);
};

export const archiveChatMessage = async (
  sessionId,
  namespace,
  messageId,
  archivedBy
) => {
  let db = firebase.firestore();
  let updateObj = {
    status: "ARCHIVED",
    archivedDate: firebase.firestore.FieldValue.serverTimestamp(),
    archivedBy
  };
  // console.log({ updateObj });
  // console.log({ sessionId, namespace, messageId, archivedBy });

  await db
    .collection("eventSessionsChatMessages")
    .doc(sessionId.toLowerCase())
    .collection(namespace)
    .doc(messageId)
    .update(updateObj);
};
