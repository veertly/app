import firebase from "./firebaseApp";
import uuidv1 from "uuid/v1";
import { MAX_PARTICIPANTS_GROUP } from "../Config/constants";

const getVideoConferenceAddress = (groupId) => `https://meet.jit.si/veertly-${groupId}`;

export const setAsAvailable = async (eventSession, userId) => {
  let currentGroupId =
    eventSession.participantsJoined[userId] && eventSession.participantsJoined[userId].groupId
      ? eventSession.participantsJoined[userId].groupId
      : null;

  if (!eventSession.participantsJoined[userId]) {
    // user is not yet added to the DB, so set it on the DB
    await firebase
      .firestore()
      .collection("eventSessions")
      .doc(eventSession.id)
      .collection("participantsJoined")
      .doc(userId)
      .set({
        groupId: currentGroupId,
        isOnline: true,
        joinedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        leftTimestamp: null,
      });
  } else {
    //user is already on the DB, so update it
    await firebase
      .firestore()
      .collection("eventSessions")
      .doc(eventSession.id)
      .collection("participantsJoined")
      .doc(userId)
      .update({
        groupId: currentGroupId,
        isOnline: true,
        joinedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        leftTimestamp: null,
      });
  }
  // console.log("SET AS AVAILABLE!!!!!!");
};

export const setAsOffline = async (eventSession, userId) => {
  // console.log(eventSession.participantsJoined[userId]);
  let currentGroupId =
    eventSession.participantsJoined[userId] && eventSession.participantsJoined[userId].groupId
      ? eventSession.participantsJoined[userId].groupId
      : null;

  if (currentGroupId) {
    leaveCall(eventSession, userId);
  }
  await firebase
    .firestore()
    .collection("eventSessions")
    .doc(eventSession.id)
    .collection("participantsJoined")
    .doc(userId)
    .update({
      leftTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      isOnline: false,
    });
};

export const createNewConversation = (eventSession, myUserId, otherUserId, snackbar) => {
  let currentGroupId =
    eventSession.participantsJoined[myUserId] && eventSession.participantsJoined[myUserId].groupId
      ? eventSession.participantsJoined[myUserId].groupId
      : null;

  const groupId = uuidv1();

  let db = firebase.firestore();

  let eventSessionRef = db.collection("eventSessions").doc(eventSession.id);

  let myUserRef = db.collection(`eventSessions`).doc(eventSession.id).collection("participantsJoined").doc(myUserId);

  let otherUserRef = db
    .collection(`eventSessions`)
    .doc(eventSession.id)
    .collection("participantsJoined")
    .doc(otherUserId);

  var currentGroupRef = currentGroupId !== null ? eventSessionRef.collection("liveGroups").doc(currentGroupId) : null;
  var newGroupRef = eventSessionRef.collection("liveGroups").doc(groupId);

  let groupParticipantsObj = {};
  groupParticipantsObj[myUserId] = {
    joinedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    leftTimestamp: null,
  };
  groupParticipantsObj[otherUserId] = {
    joinedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    leftTimestamp: null,
  };

  let groupObj = {
    id: groupId,
    startTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    videoConferenceAddress: getVideoConferenceAddress(groupId),
    participants: groupParticipantsObj,
  };

  let participantsRefCurrentGroup = {};

  if (currentGroupId !== null) {
    let participantsKeysCurrentGroup = Object.keys(eventSession.liveGroups[currentGroupId].participants);

    for (let i = 0; i < participantsKeysCurrentGroup.length; i++) {
      let userId = participantsKeysCurrentGroup[i];
      participantsRefCurrentGroup[userId] = db
        .collection(`eventSessions`)
        .doc(eventSession.id)
        .collection("participantsJoined")
        .doc(userId);
    }
  }
  /*
  1. check if other user is not in a group
  2. create live group
  3. add my user to the live group
  4. add other user to the live group
  5. update my user group id
  6. update other user group id
  */
  return db
    .runTransaction(async function (transaction) {
      let otherUserSnapshot = await transaction.get(otherUserRef);
      if (!otherUserSnapshot.exists) {
        throw new Error("Invited user doesn't exist");
      }

      let otherUser = otherUserSnapshot.data();
      if (otherUser.groupId !== null) {
        throw new Error("Oops, the invited user has started another conversation");
      }

      let myUserSnapshot = await transaction.get(myUserRef);
      let myUser = myUserSnapshot.data();
      if (myUser.groupId !== currentGroupId) {
        throw new Error(
          "Oops, it was not possible to create this conversation because someone else invited you for another conversation"
        );
      }

      // 2. if user is on a group, remove from that call
      if (currentGroupId !== null) {
        // 2.1. check if live group still exists
        let currentGroupSnapshot = await transaction.get(currentGroupRef);
        if (!currentGroupSnapshot.exists) {
          throw new Error("Your current group no longer exists");
        }

        // 2.2. check if myUser is in the group
        let currentGroup = currentGroupSnapshot.data();
        if (
          currentGroup.participants[myUserId] === null ||
          currentGroup.participants[myUserId].leftTimestamp !== null
        ) {
          throw new Error("Oops, you are no longer part of your current group");
        }

        // list the active participants on the current group
        let activeParticipantsCurrentGroup = [];
        let participantsIdsCurrentGroup = Object.keys(currentGroup.participants);
        let participantsValuesCurrentGroup = Object.values(currentGroup.participants);
        for (let i = 0; i < participantsValuesCurrentGroup.length; i++) {
          let userId = participantsIdsCurrentGroup[i];
          if (userId === myUserId) {
            continue;
          }

          let value = participantsValuesCurrentGroup[i];
          if (value.leftTimestamp === null) {
            activeParticipantsCurrentGroup.push({
              userId,
              ...value,
            });
          }
        }

        // 2.3. set leftTimestamp on my participant of the current group
        let updateObj = {};
        updateObj[`participants.${myUserId}.leftTimestamp`] = firebase.firestore.FieldValue.serverTimestamp();
        transaction.update(currentGroupRef, updateObj);

        // 2.4. check if only one participant remaining on the current group
        if (activeParticipantsCurrentGroup.length === 1) {
          //5.1 set the remaining participant group to null
          let participant = activeParticipantsCurrentGroup[0];
          transaction.update(participantsRefCurrentGroup[participant.userId], { groupId: null });

          //5.2 set the leftTimestamp on the remaining participant in the current group
          updateObj = {};
          updateObj[
            `participants.${participant.userId}.leftTimestamp`
          ] = firebase.firestore.FieldValue.serverTimestamp();
          transaction.update(currentGroupRef, updateObj);
        }
      }

      // add new group to the db
      transaction.set(newGroupRef, groupObj);

      // update my user group id
      transaction.update(myUserRef, { groupId });

      // update other user group id
      transaction.update(otherUserRef, { groupId });
    })
    .then(function () {
      // console.log("Transaction successfully committed!");
    })
    .catch(function (error) {
      console.log("Transaction failed: ", error);
      snackbar.showMessage(error.message);
      // throw error;
    });
};

export const joinConversation = (eventSession, myUserId, newGroupId, snackbar) => {
  let currentGroupId =
    eventSession.participantsJoined[myUserId] && eventSession.participantsJoined[myUserId].groupId
      ? eventSession.participantsJoined[myUserId].groupId
      : null;

  let db = firebase.firestore();

  let eventSessionRef = db.collection("eventSessions").doc(eventSession.id);

  var currentGroupRef = currentGroupId !== null ? eventSessionRef.collection("liveGroups").doc(currentGroupId) : null;
  var newGroupRef = eventSessionRef.collection("liveGroups").doc(newGroupId);

  let myUserRef = db.collection(`eventSessions`).doc(eventSession.id).collection("participantsJoined").doc(myUserId);

  let participantsRefCurrentGroup = {};

  if (currentGroupId !== null) {
    let participantsKeysCurrentGroup = Object.keys(eventSession.liveGroups[currentGroupId].participants);

    for (let i = 0; i < participantsKeysCurrentGroup.length; i++) {
      let userId = participantsKeysCurrentGroup[i];
      participantsRefCurrentGroup[userId] = db
        .collection(`eventSessions`)
        .doc(eventSession.id)
        .collection("participantsJoined")
        .doc(userId);
    }
  }
  /*
  
  // 1. check if new group has still capacity for someone else
  // 2. check if user is on a call
  // 2.1 execute the same transaction to leave a call
      1. check if live group still exists
      2. check if myUser is in the group
      3. set group to null on my user
      4. set leftTimestamp on my participant of the live group
      5. check if only one participant remaining, if so:
      5.1 set the remaining participant group to null
      5.2 set the leftTimestamp on the remaining participant
  // 3. set new groupId on the user
  // 4. add user to the participants of the new group
  // 5. 
  */

  return db
    .runTransaction(async function (transaction) {
      let newGroupSnapshot = await transaction.get(newGroupRef);
      if (!newGroupSnapshot.exists) {
        throw new Error("New group doesn't exist");
      }

      // 1. check if new group has still capacity for someone else
      let newGroup = newGroupSnapshot.data();
      let numActiveParticipantsNewGroup = 0;
      let participants = Object.values(newGroup.participants);
      for (let i = 0; i < participants.length; i++) {
        let participant = participants[i];
        if (participant.leftTimestamp === null) {
          numActiveParticipantsNewGroup++;
        }
      }

      if (numActiveParticipantsNewGroup >= MAX_PARTICIPANTS_GROUP) {
        throw new Error("Oops, this conversation group is already full!");
      }

      // 2. if user is on a group, remove from that call
      if (currentGroupId !== null) {
        // 2.1. check if live group still exists
        let currentGroupSnapshot = await transaction.get(currentGroupRef);
        if (!currentGroupSnapshot.exists) {
          throw new Error("Your current group no longer exists");
        }

        // 2.2. check if myUser is in the group
        let currentGroup = currentGroupSnapshot.data();
        if (
          currentGroup.participants[myUserId] === null ||
          currentGroup.participants[myUserId].leftTimestamp !== null
        ) {
          throw new Error("Oops, you are no longer part of your current group");
        }

        // list the active participants on the current group
        let activeParticipantsCurrentGroup = [];
        let participantsIdsCurrentGroup = Object.keys(currentGroup.participants);
        let participantsValuesCurrentGroup = Object.values(currentGroup.participants);
        for (let i = 0; i < participantsValuesCurrentGroup.length; i++) {
          let userId = participantsIdsCurrentGroup[i];
          if (userId === myUserId) {
            continue;
          }

          let value = participantsValuesCurrentGroup[i];
          if (value.leftTimestamp === null) {
            activeParticipantsCurrentGroup.push({
              userId,
              ...value,
            });
          }
        }

        // 2.3. set leftTimestamp on my participant of the current group
        let updateObj = {};
        updateObj[`participants.${myUserId}.leftTimestamp`] = firebase.firestore.FieldValue.serverTimestamp();
        transaction.update(currentGroupRef, updateObj);

        // 2.4. check if only one participant remaining on the current group
        if (activeParticipantsCurrentGroup.length === 1) {
          //5.1 set the remaining participant group to null
          let participant = activeParticipantsCurrentGroup[0];
          transaction.update(participantsRefCurrentGroup[participant.userId], { groupId: null });

          //5.2 set the leftTimestamp on the remaining participant in the current group
          updateObj = {};
          updateObj[
            `participants.${participant.userId}.leftTimestamp`
          ] = firebase.firestore.FieldValue.serverTimestamp();
          transaction.update(currentGroupRef, updateObj);
        }
      }

      // 3. set new groupId on the user
      transaction.update(myUserRef, { groupId: newGroupId });

      // 4. add user to the participants of the new group
      let updateObj = {};
      updateObj[`participants.${myUserId}.joinedTimestamp`] = firebase.firestore.FieldValue.serverTimestamp();
      updateObj[`participants.${myUserId}.leftTimestamp`] = null;
      transaction.update(newGroupRef, updateObj);
    })
    .then(function () {
      // console.log("Transaction successfully committed!");
    })
    .catch(function (error) {
      console.log("Transaction failed: ", error);
      snackbar.showMessage(error.message);
      // throw error;
    });
};

export const leaveCall = (eventSession, myUserId) => {
  let myGroupId = eventSession.participantsJoined[myUserId].groupId;
  if (!myGroupId) {
    console.log("User is not on a call...");
    return;
  }
  let db = firebase.firestore();

  let eventSessionRef = db.collection("eventSessions").doc(eventSession.id);
  let myUserRef = db.collection(`eventSessions`).doc(eventSession.id).collection("participantsJoined").doc(myUserId);

  var myGroupRef = eventSessionRef.collection("liveGroups").doc(myGroupId);

  let participantsKeys = Object.keys(eventSession.liveGroups[myGroupId].participants);
  let participantsRef = {};

  for (let i = 0; i < participantsKeys.length; i++) {
    let userId = participantsKeys[i];
    participantsRef[userId] = db
      .collection(`eventSessions`)
      .doc(eventSession.id)
      .collection("participantsJoined")
      .doc(userId);
  }

  return db
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
        throw new Error("This group no longer exists");
      }

      let myGroup = liveGroupSnapshot.data();
      if (myGroup.participants[myUserId] === null || myGroup.participants[myUserId].leftTimestamp !== null) {
        throw new Error("Oops, you are no longer part of this conversation");
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
            ...value,
          });
        }
      }

      //3. set group to null on my user
      transaction.update(myUserRef, { groupId: null });

      //4. set leftTimestamp on my participant of the live group
      let updateObj = {};
      updateObj[`participants.${myUserId}.leftTimestamp`] = firebase.firestore.FieldValue.serverTimestamp();
      transaction.update(myGroupRef, updateObj);

      //5. check if only one participant remaining
      if (activeParticipants.length === 1) {
        //5.1 set the remaining participant group to null
        let participant = activeParticipants[0];
        transaction.update(participantsRef[participant.userId], { groupId: null });

        //5.2 set the leftTimestamp on the remaining participant
        updateObj = {};
        updateObj[`participants.${participant.userId}.leftTimestamp`] = firebase.firestore.FieldValue.serverTimestamp();
        transaction.update(myGroupRef, updateObj);
      }
    })
    .then(function () {
      // console.log("Transaction successfully committed!");
    })
    .catch(function (error) {
      console.log("Transaction failed: ", error);
      // snackbar.showMessage(error);
    });
};

export const updateInNetworkingRoom = async (eventSession, myUserId, inNetworkingRoom) => {
  await firebase
    .firestore()
    .collection("eventSessions")
    .doc(eventSession.id)
    .collection("participantsJoined")
    .doc(myUserId)
    .update({
      inNetworkingRoom,
    });
};

export const createConference = async (
  isCreate,
  sessionId,
  userId,
  title,
  conferenceVideoType,
  conferenceRoomYoutubeVideoId,
  website,
  expectedAmountParticipants,
  eventBeginDate,
  eventEndDate,
  bannerPath,
  bannerUrl,
  description,
  visibility,
  eventOpens,
  eventCloses
) => {
  let normedSessionId = sessionId.toLowerCase();

  let db = firebase.firestore();
  let eventsSessionDetailsRef = db.collection("eventSessionsDetails").doc(normedSessionId);
  let eventSessionRef = db.collection("eventSessions").doc(normedSessionId);

  let x = (str) => (str ? str : "");

  let eventDetails = {
    id: normedSessionId,
    originalSessionId: sessionId,
    title: x(title),
    conferenceVideoType: x(conferenceVideoType),
    conferenceRoomYoutubeVideoId: x(conferenceRoomYoutubeVideoId),
    website: x(website),
    expectedAmountParticipants: x(expectedAmountParticipants),
    eventBeginDate: firebase.firestore.Timestamp.fromDate(eventBeginDate),
    eventEndDate: firebase.firestore.Timestamp.fromDate(eventEndDate),
    owner: userId,
    isNetworkingAvailable: true,
    description: x(description),
    visibility: x(visibility),
    eventOpens: x(eventOpens),
    eventCloses: x(eventCloses),
  };

  if (isCreate || bannerUrl !== null) {
    eventDetails.bannerPath = bannerPath;
    eventDetails.bannerUrl = bannerUrl;
  }

  if (isCreate) {
    eventDetails.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  } else {
    eventDetails.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  }

  const eventSession = {
    id: sessionId,
    originalSessionId: sessionId,
    owner: userId,
  };

  return db
    .runTransaction(async function (transaction) {
      let eventsSessionDetailsSnapshot = await transaction.get(eventsSessionDetailsRef);
      let sessionDetailsExists = eventsSessionDetailsSnapshot.exists;
      if (isCreate && sessionDetailsExists) {
        throw new Error("Event already exists");
      }

      let eventSessionSnapshot = await transaction.get(eventSessionRef);
      let eventSessionExists = eventSessionSnapshot.exists;
      if (isCreate && eventSessionExists) {
        throw new Error("Event session already exists");
      }
      if (!sessionDetailsExists) {
        transaction.set(eventsSessionDetailsRef, eventDetails);
      } else {
        transaction.update(eventsSessionDetailsRef, eventDetails);
      }

      if (!eventSessionExists) {
        transaction.set(eventSessionRef, eventSession);
      } else {
        transaction.update(eventSessionRef, eventSession);
      }
    })
    .then(function () {
      // console.log("Transaction successfully committed!");
    })
    .catch(function (error) {
      // snackbar.showMessage(error.message);
      throw error;
    });
};
