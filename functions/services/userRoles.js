const { firestore, admin } = require("../modules/firebase");
const functions = require("firebase-functions");

const { isEventOwner } = require("../helpers/permissions");

module.exports = {};

module.exports.setUserRole = async (data, context) => {
  const { eventSessionId, role, userId } = data;
  const { uid: callerUserId } = context.auth;

  if (!(await isEventOwner(eventSessionId, callerUserId))) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Operation only possible for the event owner"
    );
  }
  const participantsDetailsRef = firestore
    .collection("eventSessions")
    .doc(eventSessionId)
    .collection("participantsDetails")
    .doc(userId);

  await participantsDetailsRef.update({
    roles: admin.firestore.FieldValue.arrayUnion(role)
  });

  return {
    role
  };
};

module.exports.unsetUserRole = async (data, context) => {
  const { eventSessionId, role, userId } = data;
  const { uid: callerUserId } = context.auth;

  if (!(await isEventOwner(eventSessionId, callerUserId))) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Operation only possible for the event owner"
    );
  }

  const participantsDetailsRef = firestore
    .collection("eventSessions")
    .doc(eventSessionId)
    .collection("participantsDetails")
    .doc(userId);

  await participantsDetailsRef.update({
    roles: admin.firestore.FieldValue.arrayRemove(role)
  });

  return {
    role
  };
};
