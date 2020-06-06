import firebase from "./firebaseApp";
import { v1 as uuidv1 } from "uuid";
import { MAX_PARTICIPANTS_GROUP } from "../Config/constants";
import { VERTICAL_NAV_OPTIONS } from "../Contexts/VerticalNavBarContext";
import _ from "lodash";

const getVideoConferenceAddress = (groupId) => `veertly-${groupId}`;

export const createNewConversation = (
  originalSessionId,
  myUserId,
  otherUserId,
  currentUserGroup,
  snackbar
) => {
  let currentGroupId = currentUserGroup ? currentUserGroup.id : null;
  // participantsJoined[myUserId] && participantsJoined[myUserId].groupId
  //   ? participantsJoined[myUserId].groupId
  //   : null;
  const sessionId = originalSessionId.toLowerCase();
  const groupId = uuidv1();

  let db = firebase.firestore();

  let eventSessionRef = db.collection("eventSessions").doc(sessionId);

  let myUserRef = db
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(myUserId);

  let otherUserRef = db
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(otherUserId);

  var currentGroupRef =
    currentGroupId !== null
      ? eventSessionRef.collection("liveGroups").doc(currentGroupId)
      : null;
  var newGroupRef = eventSessionRef.collection("liveGroups").doc(groupId);

  let groupParticipantsObj = {};
  groupParticipantsObj[myUserId] = {
    joinedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    leftTimestamp: null,
    id: myUserId
  };
  groupParticipantsObj[otherUserId] = {
    joinedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    leftTimestamp: null,
    id: otherUserId
  };

  let groupObj = {
    id: groupId,
    startTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    videoConferenceAddress: getVideoConferenceAddress(groupId),
    participants: groupParticipantsObj,
    isLive: true
  };

  let participantsRefCurrentGroup = {};

  if (currentGroupId !== null) {
    let participantsKeysCurrentGroup = Object.keys(
      currentUserGroup.participants
    );

    for (let i = 0; i < participantsKeysCurrentGroup.length; i++) {
      let userId = participantsKeysCurrentGroup[i];
      participantsRefCurrentGroup[userId] = db
        .collection("eventSessions")
        .doc(sessionId)
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
        throw new Error(
          "Oops, the invited user has started another conversation"
        );
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
        let participantsIdsCurrentGroup = Object.keys(
          currentGroup.participants
        );
        let participantsValuesCurrentGroup = Object.values(
          currentGroup.participants
        );
        for (let i = 0; i < participantsValuesCurrentGroup.length; i++) {
          let userId = participantsIdsCurrentGroup[i];
          if (userId === myUserId) {
            continue;
          }

          let value = participantsValuesCurrentGroup[i];
          if (value.leftTimestamp === null) {
            activeParticipantsCurrentGroup.push({
              userId,
              ...value
            });
          }
        }

        // 2.3. set leftTimestamp on my participant of the current group
        let updateObj = {};
        updateObj[
          `participants.${myUserId}.leftTimestamp`
        ] = firebase.firestore.FieldValue.serverTimestamp();
        transaction.update(currentGroupRef, updateObj);

        // 2.4. check if only one participant remaining on the current group (if not a room)
        if (
          !currentGroup.isRoom &&
          activeParticipantsCurrentGroup.length === 1
        ) {
          //5.1 set the remaining participant group to null
          let participant = activeParticipantsCurrentGroup[0];
          transaction.update(participantsRefCurrentGroup[participant.userId], {
            groupId: null
          });

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
      transaction.update(myUserRef, {
        groupId,
        currentLocation: VERTICAL_NAV_OPTIONS.networking
      });

      // update other user group id
      transaction.update(otherUserRef, {
        groupId,
        currentLocation: VERTICAL_NAV_OPTIONS.networking
      });
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

export const joinConversation = (
  originalSessionId,
  participantsJoined,
  liveGroups,
  myUserId,
  newGroupId,
  snackbar
) => {
  const sessionId = originalSessionId.toLowerCase();

  let currentGroupId =
    participantsJoined[myUserId] && participantsJoined[myUserId].groupId
      ? participantsJoined[myUserId].groupId
      : null;

  let db = firebase.firestore();

  let eventSessionRef = db.collection("eventSessions").doc(sessionId);

  var currentGroupRef =
    currentGroupId !== null
      ? eventSessionRef.collection("liveGroups").doc(currentGroupId)
      : null;
  var newGroupRef = eventSessionRef.collection("liveGroups").doc(newGroupId);

  let myUserRef = db
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(myUserId);

  let participantsRefCurrentGroup = {};

  if (currentGroupId !== null) {
    let participantsKeysCurrentGroup = Object.keys(
      liveGroups[currentGroupId].participants // TODO:  this may lead to the error: Cannot read property 'participants' of undefined. Will be fixed with the more reliable data model
    );

    for (let i = 0; i < participantsKeysCurrentGroup.length; i++) {
      let userId = participantsKeysCurrentGroup[i];
      participantsRefCurrentGroup[userId] = db
        .collection("eventSessions")
        .doc(sessionId)
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
      const isRoomNewGroup = newGroup.isRoom;
      let numActiveParticipantsNewGroup = 0;
      let participants = Object.values(newGroup.participants);
      for (let i = 0; i < participants.length; i++) {
        let participant = participants[i];
        if (participant.leftTimestamp === null) {
          numActiveParticipantsNewGroup++;
        }
      }

      if (
        !isRoomNewGroup &&
        numActiveParticipantsNewGroup >= MAX_PARTICIPANTS_GROUP
      ) {
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
        const isRoomCurrentGroup = currentGroup.isRoom;
        if (
          currentGroup.participants[myUserId] === null ||
          currentGroup.participants[myUserId].leftTimestamp !== null
        ) {
          throw new Error("Oops, you are no longer part of your current group");
        }

        // list the active participants on the current group
        let activeParticipantsCurrentGroup = [];
        let participantsIdsCurrentGroup = Object.keys(
          currentGroup.participants
        );
        let participantsValuesCurrentGroup = Object.values(
          currentGroup.participants
        );
        for (let i = 0; i < participantsValuesCurrentGroup.length; i++) {
          let userId = participantsIdsCurrentGroup[i];
          if (userId === myUserId) {
            continue;
          }

          let value = participantsValuesCurrentGroup[i];
          if (value.leftTimestamp === null) {
            activeParticipantsCurrentGroup.push({
              userId,
              ...value
            });
          }
        }

        // 2.3. set leftTimestamp on my participant of the current group
        let updateObj = {};
        updateObj[
          `participants.${myUserId}.leftTimestamp`
        ] = firebase.firestore.FieldValue.serverTimestamp();
        transaction.update(currentGroupRef, updateObj);

        // 2.4. check if only one participant remaining on the current group (if not room)
        if (
          !isRoomCurrentGroup &&
          activeParticipantsCurrentGroup.length === 1
        ) {
          //5.1 set the remaining participant group to null
          let participant = activeParticipantsCurrentGroup[0];
          transaction.update(participantsRefCurrentGroup[participant.userId], {
            groupId: null
          });

          //5.2 set the leftTimestamp on the remaining participant in the current group
          updateObj = {};
          updateObj[
            `participants.${participant.userId}.leftTimestamp`
          ] = firebase.firestore.FieldValue.serverTimestamp();
          transaction.update(currentGroupRef, updateObj);
        }
      }

      // 3. set new groupId on the user
      transaction.update(myUserRef, {
        groupId: newGroupId,
        currentLocation: isRoomNewGroup
          ? VERTICAL_NAV_OPTIONS.rooms
          : VERTICAL_NAV_OPTIONS.networking
      });

      // 4. add user to the participants of the new group
      let updateObj = {};
      updateObj[
        `participants.${myUserId}.joinedTimestamp`
      ] = firebase.firestore.FieldValue.serverTimestamp();
      updateObj[`participants.${myUserId}.leftTimestamp`] = null;
      updateObj[`participants.${myUserId}.id`] = myUserId;
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

export const leaveCall = (originalSessionId, group, myUserId) => {
  if (!group) {
    console.log("User is not on a call...");
    return;
  }
  const sessionId = originalSessionId.toLowerCase();

  let myGroupId = group.id;

  let db = firebase.firestore();

  let eventSessionRef = db.collection("eventSessions").doc(sessionId);
  let myUserRef = db
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(myUserId);

  var myGroupRef = eventSessionRef.collection("liveGroups").doc(myGroupId);

  let participantsKeys = Object.keys(group.participants);
  let participantsRef = {};

  for (let i = 0; i < participantsKeys.length; i++) {
    let userId = participantsKeys[i];
    participantsRef[userId] = db
      .collection("eventSessions")
      .doc(sessionId)
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
      if (
        myGroup.participants[myUserId] === null ||
        myGroup.participants[myUserId].leftTimestamp !== null
      ) {
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
      ] = firebase.firestore.FieldValue.serverTimestamp();
      transaction.update(myGroupRef, updateObj);

      //5. check if only one participant remaining (if not room)
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
        ] = firebase.firestore.FieldValue.serverTimestamp();
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

export const editRoom = async (
  originalSessionId,
  roomId,
  roomName,
  roomDescription,
  userId,
  snackbar
) => {
  const sessionId = originalSessionId.toLowerCase();
  let db = firebase.firestore();
  let roomRef = db
    .collection("eventSessions")
    .doc(sessionId)
    .collection("liveGroups")
    .doc(roomId);

  let roomSnapshot = await roomRef.get();
  if (!roomSnapshot.exists) {
    if (snackbar) snackbar.showMessage("This room no longer exists");
    return false;
  }
  await roomRef.update({
    roomName,
    roomDescription,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedBy: userId
  });
  snackbar.showMessage("Room edited successfully");
};

export const archiveRoom = async (
  originalSessionId,
  roomId,
  userId,
  snackbar
) => {
  const sessionId = originalSessionId.toLowerCase();

  let db = firebase.firestore();
  let roomRef = db
    .collection("eventSessions")
    .doc(sessionId)
    .collection("liveGroups")
    .doc(roomId);

  let roomSnapshot = await roomRef.get();
  if (!roomSnapshot.exists) {
    if (snackbar) snackbar.showMessage("This room no longer exists");
    return false;
  }
  await roomRef.update({
    isLive: false,
    archivedAt: firebase.firestore.FieldValue.serverTimestamp(),
    archivedBy: userId
  });
  snackbar.showMessage("Room archived successfully");
};

export const createNewRoom = async (
  originalSessionId,
  roomName,
  roomDescription,
  myUserId
) => {
  const groupId = `r_${uuidv1()}`;

  let db = firebase.firestore();
  const sessionId = originalSessionId.toLowerCase();
  let eventSessionRef = db.collection("eventSessions").doc(sessionId);

  var newGroupRef = eventSessionRef.collection("liveGroups").doc(groupId);

  let groupObj = {
    id: groupId,
    startTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    videoConferenceAddress: getVideoConferenceAddress(groupId),
    participants: {},
    isLive: true,
    isRoom: true,
    roomName,
    roomDescription,
    roomCreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    roomOwner: myUserId
  };

  await newGroupRef.set(groupObj);
};

export const updateInNetworkingRoom = async (
  originalSessionId,
  myUserId,
  inNetworkingRoom
) => {
  const sessionId = originalSessionId.toLowerCase();

  await firebase
    .firestore()
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(myUserId)
    .update({
      inNetworkingRoom
    });
};

export const createConference = async (
  isCreate,
  sessionId,
  userId,
  title,
  conferenceVideoType,
  conferenceRoomYoutubeVideoId,
  conferenceRoomFacebookLink,
  customJitsiServer,
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
  let eventsSessionDetailsRef = db
    .collection("eventSessionsDetails")
    .doc(normedSessionId);
  let eventSessionRef = db.collection("eventSessions").doc(normedSessionId);

  let x = (str) => (str ? str : "");

  let eventDetails = {
    id: normedSessionId,
    originalSessionId: sessionId,
    title: x(title),
    conferenceVideoType: x(conferenceVideoType),
    conferenceRoomYoutubeVideoId: x(conferenceRoomYoutubeVideoId),
    conferenceRoomFacebookLink: x(conferenceRoomFacebookLink),
    customJitsiServer: x(customJitsiServer),
    website: x(website),
    expectedAmountParticipants: x(expectedAmountParticipants),
    eventBeginDate: firebase.firestore.Timestamp.fromDate(eventBeginDate),
    eventEndDate: firebase.firestore.Timestamp.fromDate(eventEndDate),
    owner: userId,
    isNetworkingAvailable: true,
    description: x(description),
    visibility: x(visibility),
    eventOpens: x(eventOpens),
    eventCloses: x(eventCloses)
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
    owner: userId
  };

  return db
    .runTransaction(async function (transaction) {
      let eventsSessionDetailsSnapshot = await transaction.get(
        eventsSessionDetailsRef
      );
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
export const reorderRooms = async (
  originalSessionId,
  orderedRooms,
  // myUserId,
  // currentUserGroup,
  snackbar
) => {
  let db = firebase.firestore();

  var batch = db.batch();

  const sessionId = originalSessionId.toLowerCase();

  let eventSessionRef = db.collection("eventSessions").doc(sessionId);

  var liveGroupsCollectionRef = eventSessionRef.collection("liveGroups");

  _.forEach(orderedRooms, (room, index) => {
    const roomRef = liveGroupsCollectionRef.doc(room.id);
    batch.update(roomRef, { order: index });
  });

  await batch.commit();
};

// // set video mute status
// export const setVideoMuteStatusDB = async (muteVideo, originalSessionId) => {
//   const sessionId = originalSessionId.toLowerCase();
//   await firebase
//   .firestore()
//   .collection("eventSessions")
//   .doc(sessionId)
//   .set({
//     muteVideo: muteVideo
//   }, {
//     merge: true
//   })
// }

// // set audio mute status
// export const setAudioMuteStatusDB = async (muteAudio, originalSessionId) => {
//   const sessionId = originalSessionId.toLowerCase();
//   await firebase
//   .firestore()
//   .collection("eventSessions")
//   .doc(sessionId)
//   .set({
//     muteAudio: muteAudio
//   }, {
//     merge: true
//   })
// }

// // set technical check shown for event session
// export const setTechnicalCheckShowDB = async (technicalCheckShown, originalSessionId) => {
//   const sessionId = originalSessionId.toLowerCase();
//   await firebase
//   .firestore()
//   .collection("eventSessions")
//   .doc(sessionId)
//   .set({
//     technicalCheckShown: technicalCheckShown
//   }, {
//     merge: true
//   })
// }
