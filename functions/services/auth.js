const { firestore, admin } = require("../modules/firebase");

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

  if (password === passwordEvent) {
    // set logged in parameter to event session object

    const loginId = new Date().getTime();

    const userRef = firestore
      .collection("eventSessions")
      .doc(eventSessionId)
      .collection("participantsJoined")
      .doc(uid);

    userRef.set(
      {
        isAuthorized: true,
        loggedInAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    const loginRef = firestore
      .collection("eventSessions")
      .doc(eventSessionId)
      .collection("participantsJoined")
      .doc(uid)
      .collection("loginAttempts")
      .doc("" + loginId);

    loginRef.set(
      {
        withCode: password && password.trim() !== "",
        loggedInAt: admin.firestore.FieldValue.serverTimestamp()
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
