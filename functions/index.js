const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const firestore = admin.firestore();

exports.onUserStatusChanged = functions.database
  .ref("/sessionUsersStatus/{sessionId}/{userId}")
  .onUpdate(async (change, context) => {
    const eventStatus = change.after.val();

    let { sessionId, userId } = context.params;

    var userStatusFirestoreRef = firestore
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsJoined")
      .doc(userId);

    const statusSnapshot = await change.after.ref.once("value");

    const status = statusSnapshot.val();
    console.log(status, eventStatus);

    // If the current timestamp for this data is newer than
    // the data that triggered this event, we exit this function.
    if (status.lastChanged > eventStatus.lastChanged) {
      return null;
    }

    // Otherwise, we convert the last_changed field to a Date
    eventStatus.lastChanged = new Date(eventStatus.lastChanged);
    eventStatus.leftTimestamp = eventStatus.leftTimestamp ? new Date(eventStatus.leftTimestamp) : null;
    eventStatus.joinedTimestamp = eventStatus.joinedTimestamp ? new Date(eventStatus.joinedTimestamp) : null;

    // ... and write it to Firestore.
    return userStatusFirestoreRef.update(eventStatus);
  });
