const functions = require("firebase-functions");

const { firestore, admin } = require("./modules/firebase");

const moment = require("moment");

const sendgrid = require("./modules/sendgrid");
const slack = require("./modules/slack");

const userRolesFunctions = require("./services/userRoles");

const leaveCall = async (sessionId, myUserId) => {
  var eventSessionRef = firestore.collection("eventSessions").doc(sessionId);
  // var eventSessionSnapshot = await eventSessionRef.get();

  // let eventSession = eventSessionSnapshot.data();

  var participantsJoinedRef = await firestore
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined");

  let participantsJoinedSnapshot = await participantsJoinedRef.get();
  let participantsJoined = {};
  await participantsJoinedSnapshot.forEach(function (doc) {
    participantsJoined[doc.id] = doc.data();
  });

  let myGroupId = participantsJoined[myUserId].groupId;
  if (!myGroupId) {
    console.log("Participant is not on a call...");
    console.log({ myGroup: participantsJoined[myUserId] });
    return;
  }

  var liveGroupsRef = await firestore
    .collection("eventSessions")
    .doc(sessionId)
    .collection("liveGroups");

  let liveGroupsSnapshot = await liveGroupsRef.get();
  let liveGroups = {};

  await liveGroupsSnapshot.forEach(function (doc) {
    liveGroups[doc.id] = doc.data();
  });

  let myUserRef = firestore
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(myUserId);

  var myGroupRef = eventSessionRef.collection("liveGroups").doc(myGroupId);

  let participantsKeys = Object.keys(liveGroups[myGroupId].participants);
  let participantsRef = {};

  for (let i = 0; i < participantsKeys.length; i++) {
    let userId = participantsKeys[i];
    participantsRef[userId] = firestore
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsJoined")
      .doc(userId);
  }

  await firestore
    .runTransaction(async function (transaction) {
      /*
      1. check if live group still exists
      2. check if myUser is in the group
      3. set group to null on my user
      4. set leftTimestamp on my participant of the live group
      5. check if only one participant remaining, if so:
      5.1 set the remaining participant group to null
      5.2 set the leftTimestamp on the remaining participant
      */

      let liveGroupSnapshot = await transaction.get(myGroupRef);
      if (!liveGroupSnapshot.exists) {
        console.log("This group no longer exists");
        return;
      }

      let myGroup = liveGroupSnapshot.data();
      if (
        myGroup.participants[myUserId] === null ||
        myGroup.participants[myUserId].leftTimestamp !== null
      ) {
        console.log("Oops, user is no longer part of this conversation");
      }

      let activeParticipants = [];
      let participantsIds = Object.keys(myGroup.participants);
      let participantsValues = Object.values(myGroup.participants);
      for (let i = 0; i < participantsValues.length; i++) {
        let userId = participantsIds[i];
        if (userId === myUserId) {
          continue;
        }

        let value = participantsValues[i];
        if (value.leftTimestamp === null) {
          activeParticipants.push({
            userId,
            ...value
          });
        }
      }

      //3. set group to null on my user
      transaction.update(myUserRef, { groupId: null });

      //4. set leftTimestamp on my participant of the live group
      let updateObj = {};
      updateObj[
        `participants.${myUserId}.leftTimestamp`
      ] = admin.firestore.FieldValue.serverTimestamp();
      transaction.update(myGroupRef, updateObj);

      //5. check if only one participant remaining
      if (!myGroup.isRoom && activeParticipants.length === 1) {
        //5.1 set the remaining participant group to null
        let participant = activeParticipants[0];
        transaction.update(participantsRef[participant.userId], {
          groupId: null
        });

        //5.2 set the leftTimestamp on the remaining participant
        updateObj = {};
        updateObj[
          `participants.${participant.userId}.leftTimestamp`
        ] = admin.firestore.FieldValue.serverTimestamp();
        transaction.update(myGroupRef, updateObj);
      }

      console.log("---> END OF TRANSACTION");
    })
    .then(function () {
      console.log("Transaction successfully committed!");
    })
    .catch(function (error) {
      console.log("Transaction failed: ", error);
      throw error;
      // snackbar.showMessage(error);
    });

  console.log("++++> END OF Leave Call");
};

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
      console.log("+++ Newer document exists, ignoring this change...");
      return null;
    }

    // Otherwise, we convert the last_changed field to a Date
    eventStatus.lastChanged = new Date(eventStatus.lastChanged);
    eventStatus.leftTimestamp = eventStatus.leftTimestamp
      ? new Date(eventStatus.leftTimestamp)
      : null;
    eventStatus.joinedTimestamp = eventStatus.joinedTimestamp
      ? new Date(eventStatus.joinedTimestamp)
      : null;

    if (!eventStatus.leftTimestamp) {
      console.log("----------> User OFFLINE");
      await leaveCall(sessionId, userId);
    }

    // ... and write it to Firestore.
    let result = await userStatusFirestoreRef.update(eventStatus);

    if (
      eventStatus.joinedTimestamp &&
      !eventStatus.leftTimestamp &&
      sessionId === "demo"
    ) {
      var userRef = await firestore.collection("users").doc(userId);
      let userSnap = await userRef.get();
      let user = userSnap.data();

      await slack.newPersonOnDemo(user);
    }

    return result;
  });

exports.onEventCreated = functions.firestore
  .document("eventSessionsDetails/{sessionId}")
  .onCreate(async (snap, context) => {
    const eventDetails = snap.data();
    const { owner, title } = eventDetails;

    let { sessionId } = context.params;

    const config = functions.config();
    let baseUrl = config.global ? config.global.base_url : "";

    var ownerRef = await firestore.collection("users").doc(owner);

    let ownerSnapshot = await ownerRef.get();
    let ownerData = ownerSnapshot.data();
    let eventLink = baseUrl + "/v/" + sessionId;
    await sendgrid.sendEventCreatedMail(
      ownerData.email,
      ownerData.firstName,
      eventLink,
      title
    );

    await slack.newEventNotification(eventDetails);
  });

exports.onUserRegisteredEvent = functions.firestore
  .document("eventSessionsRegistrations/{sessionId}/registrations/{ts}")
  .onCreate(async (snap, context) => {
    const { firstName, email, title, eventBeginDate } = snap.data();
    let { sessionId } = context.params;

    var featureRef = await firestore
      .collection("eventSessionsEnabledFeatures")
      .doc(sessionId);

    let feature = (await featureRef.get()).data();
    if (feature.rsvp) {
      let { registrationEmailTemplateId } = feature.rsvp;

      let baseUrl = functions.config().global.base_url;
      let eventLink = baseUrl + "/v/" + sessionId;

      let eventDate = moment(eventBeginDate.toDate()).format(
        "DD MMMM YYYY HH:mm"
      ); //TODO: make it in the format of the user's locale

      if (email && email.trim() !== "") {
        await sendgrid.sendUserRegistered(
          email,
          firstName,
          eventLink,
          title,
          eventDate,
          registrationEmailTemplateId
        );
      } else {
        await sendgrid.sendUserRegistered(
          "info@veertly.com",
          "GUEST-" + firstName,
          eventLink,
          title,
          eventDate,
          registrationEmailTemplateId
        );
      }
    }
  });

// This is a callable function. We can directly call it from app.
// It will check the eventSessionsPrivateDetails and verify the password
// If password matches => set loggedIn to true in userSession Object.
exports.loginInEvent = functions.https.onCall(async (data, context) => {
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
});

// exports.createBroadcastMessage = functions.https.onCall(async (data, context) => {
//   const {
//     sessionId,
//     userId,
//     message,
//     state,
//     namespace,
//   } = data;

//   const broadcastMessageId = String(new Date().getTime());

//   const broadcastMessageToBeSaved = {
//     id: broadcastMessageId,
//     owner: userId,
//     creationDate: admin.firestore.FieldValue.serverTimestamp(),
//     message,
//     state,
//   };

//   try {
//     await firestore
//       .collection("eventSessions")
//       .doc(sessionId.toLowerCase())
//       .collection("broadcasts")
//       .doc(namespace)
//       .collection("broadcastsMessages")
//       .doc(broadcastMessageId)
//       .set(broadcastMessageToBeSaved);

//     setTimeout(() => {
//       // set it to published now
//       const broadcastRef = firestore
//         .collection("eventSessions")
//         .doc(sessionId.toLowerCase())
//         .collection("broadcasts")
//         .doc(namespace)
//         .collection("broadcastsMessages")
//         .doc(`${broadcastMessageId}`);

//       broadcastRef.update({
//         state: "published"
//       });
//     }, 40000)
//   } catch (error) {
//     console.log(error);
//   }
// });
exports.setUserRole = functions.https.onCall(userRolesFunctions.setUserRole);

exports.unsetUserRole = functions.https.onCall(
  userRolesFunctions.unsetUserRole
);
