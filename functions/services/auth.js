const { firestore } = require("../modules/firebase");

module.exports = {};

module.exports.loginInEvent = async (data, context) => {
  const { password, eventSessionId } = data;
  const { uid } = context.auth;
  // console.log(`password=${password}, eventSessionId=${eventSessionId}, uid=${uid}`)
  const eventSessionPrivateRef = firestore
    .collection("eventSessionsPrivateDetails")
    .doc(eventSessionId);
  const eventSessionDataDoc = await eventSessionPrivateRef.get();

  const passwordEvent = eventSessionDataDoc.exists
    ? eventSessionDataDoc.data().password
    : "";
  // console.log("password in db", passwordEvent);
  if (passwordEvent && password === passwordEvent) {
    // set logged in parameter to event session object
    const userRef = firestore
      .collection("eventSessions")
      .doc(eventSessionId)
      .collection("participantsJoined")
      .doc(uid);
    userRef.set(
      {
        isAuthenticated: true
      },
      { merge: true }
    );
    return {
      success: true
    };
  } else {
    return {
      success: false
    };
  }
};
