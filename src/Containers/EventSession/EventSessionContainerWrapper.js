import React, { useEffect, useState, useMemo } from "react";
import {
  useCollectionData,
  useDocumentData
} from "react-firebase-hooks/firestore";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import firebase from "../../Modules/firebaseApp";
import { leaveCall } from "../../Modules/eventSessionOperations";
import routes from "../../Config/routes";
import {
  initFirebasePresenceSync,
  keepAlive,
  getUserDb,
  updateUser
} from "../../Modules/userOperations";

import {
  DEFAULT_KEEP_ALIVE_INTERVAL,
  DEFAULT_KEEP_ALIVE_CHECK_INTERVAL
} from "../../Config/constants";
import {
  updateEventSession,
  updateEventSessionDetails,
  updateParticipantsJoined,
  updateLiveGroups,
  updateUsers,
  getParticipantsJoined,
  getLiveGroups,
  updateUserId,
  getUser,
  getUserSession,
  getUserGroup,
  setStateLoaded,
  isStateLoaded,
  crossCheckKeepAlives,
  setEnabledFeatures
} from "../../Redux/eventSession";
import useInterval from "../../Hooks/useInterval";
import SplashScreen from "../../Components/Misc/SplashScreen";
import { JitsiContextProvider } from "../../Contexts/JitsiContext";

import { VerticalNavBarContextWrapper } from "../../Contexts/VerticalNavBarContext";
import EventSessionContainer from "./EventSessionContainer";
import { openRoomArchived } from "../../Redux/dialogs";
import { ChatMessagesContextWrapper } from "../../Contexts/ChatMessagesContext";
import EventSessionContainerTheme from "./EventSessionContainerTheme";
import ChatDraftMessageProvider from "../../Providers/ChatDraftMessageProvider";
import { SmallPlayerContextProvider } from "../../Contexts/SmallPlayerContext";
import { BroadcastMessagesProvider } from "../../Contexts/BroadcastMessagesContext";
import ParticipantBroadcastDialogContainer from "../../Components/EventSession/ParticipantBroadcastDialogContainer";
import { PollsContextWrapper } from "../../Contexts/PollsContext";
import { TechnicalCheckProvider } from "../../Contexts/TechnicalCheckContext";

const EventSessionContainerWrapper = (props) => {
  const dispatch = useDispatch();

  const [userAuth] = useAuthState(firebase.auth());

  const [initCompleted, setInitCompleted] = useState(false);

  const history = useHistory();

  const location = useLocation();

  const { sessionId: originalSessionId } = useParams();

  const sessionId = useMemo(
    () => (originalSessionId ? originalSessionId.toLowerCase() : null),
    [originalSessionId]
  );

  const userId = useMemo(() => (userAuth ? userAuth.uid : null), [userAuth]);

  // --- eventSessionDB ---
  const [eventSessionDB, loadingSessionDB, errorSessionDB] = useDocumentData(
    firebase.firestore().collection("eventSessions").doc(sessionId)
  );
  const [lastEventSessionDBJson, setLastEventSessionDBJson] = useState("");
  useEffect(() => {
    const currentEventSessionDBJson = JSON.stringify(eventSessionDB);

    if (lastEventSessionDBJson !== currentEventSessionDBJson) {
      dispatch(updateEventSession(eventSessionDB));
      setLastEventSessionDBJson(currentEventSessionDBJson);
    }
  }, [eventSessionDB, lastEventSessionDBJson, dispatch]);

  // --- eventSessionDetailsDB ---
  const [
    eventSessionDetailsDB,
    loadingSessionDetailsDB,
    errorSessionDetailsDB
  ] = useDocumentData(
    firebase.firestore().collection("eventSessionsDetails").doc(sessionId)
  );
  const [
    lastEventSessionDetailsDBJson,
    setLastEventSessionDetailsDBJson
  ] = useState("");
  useEffect(() => {
    if (!eventSessionDetailsDB && !loadingSessionDetailsDB) {
      history.push(routes.EVENT_SESSION(sessionId));
    }
    const currentEventSessionDetailsDBJson = JSON.stringify(
      eventSessionDetailsDB
    );

    if (lastEventSessionDetailsDBJson !== currentEventSessionDetailsDBJson) {
      dispatch(updateEventSessionDetails(eventSessionDetailsDB));
      setLastEventSessionDetailsDBJson(currentEventSessionDetailsDBJson);
    }
  }, [
    eventSessionDetailsDB,
    lastEventSessionDetailsDBJson,
    dispatch,
    loadingSessionDetailsDB,
    history,
    sessionId
  ]);

  // --- participantsJoinedDB ---
  const [
    participantsJoinedDB,
    loadingParticipantsJoinedDB,
    errorParticipantsJoinedDB
  ] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsJoined"),
    // .where("isOnline", "==", true),
    { idField: "id" }
  );
  const [lastParticipantsJoinedDB, setLastParticipantsJoinedDB] = useState("");
  useEffect(() => {
    const currentParticipantsJoinedDB = JSON.stringify(participantsJoinedDB);

    if (lastParticipantsJoinedDB !== currentParticipantsJoinedDB) {
      dispatch(updateParticipantsJoined(participantsJoinedDB));
      setLastParticipantsJoinedDB(currentParticipantsJoinedDB);
    }
  }, [participantsJoinedDB, lastParticipantsJoinedDB, dispatch]);

  // --- keepALivesDB ---
  const [keepALivesDB] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("keepAlive"),
    { idField: "id" }
  );

  // --- liveGroupsDB ---
  const [
    liveGroupsDB,
    loadingLiveGroupsDB,
    errorLiveGroupsDB
  ] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("liveGroups"),
    { idField: "id" }
  );
  const [lastLiveGroupsDB, setLastLiveGroupsDB] = useState("");
  useEffect(() => {
    const currentLiveGroupsDB = JSON.stringify(liveGroupsDB);

    if (lastLiveGroupsDB !== currentLiveGroupsDB) {
      dispatch(updateLiveGroups(liveGroupsDB));
      setLastLiveGroupsDB(currentLiveGroupsDB);
    }
  }, [liveGroupsDB, lastLiveGroupsDB, dispatch]);

  // --- usersDB ---
  const [usersDB, loadingUsersDB, errorUsersDB] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsDetails")
  );
  const [lastUsersDB, setLastUsersDB] = useState("");
  useEffect(() => {
    const currentUsersDB = JSON.stringify(usersDB);

    if (lastUsersDB !== currentUsersDB) {
      dispatch(updateUsers(usersDB));
      setLastUsersDB(currentUsersDB);
    }
  }, [usersDB, lastUsersDB, dispatch]);

  // --- eventSessionsEnabledFeaturesDB ---
  const [eventSessionsEnabledFeaturesDB] = useDocumentData(
    firebase
      .firestore()
      .collection("eventSessionsEnabledFeatures")
      .doc(sessionId)
  );
  const [
    lastEventSessionsEnabledFeaturesDB,
    setLastEventSessionsEnabledFeaturesDB
  ] = useState("");
  useEffect(() => {
    const currentEventSessionEnabledFeaturesDBJson = JSON.stringify(
      eventSessionsEnabledFeaturesDB
    );
    if (
      lastEventSessionsEnabledFeaturesDB !==
      currentEventSessionEnabledFeaturesDBJson
    ) {
      dispatch(setEnabledFeatures(eventSessionsEnabledFeaturesDB));
      setLastEventSessionsEnabledFeaturesDB(
        currentEventSessionEnabledFeaturesDBJson
      );
    }
  }, [
    eventSessionsEnabledFeaturesDB,
    lastEventSessionsEnabledFeaturesDB,
    dispatch
  ]);

  // --- userId ---
  useEffect(() => {
    dispatch(updateUserId(userId));
  }, [userId, dispatch]);

  // --- Redux values ---
  const stateLoaded = useSelector(isStateLoaded);
  const participantsJoined = useSelector(getParticipantsJoined, shallowEqual);
  const liveGroups = useSelector(getLiveGroups, shallowEqual);
  const user = useSelector(getUser, shallowEqual);
  const userSession = useSelector(getUserSession, shallowEqual);
  const userGroup = useSelector(getUserGroup, shallowEqual);
  const [
    lastRoomArchivedInformed,
    setLastRoomArchivedInformed
  ] = React.useState(null);

  // --- handle room archived snackbar ---
  useEffect(() => {
    const userGroupJson = JSON.stringify(userGroup);
    if (
      userGroup &&
      userGroup.isLive === false &&
      userGroupJson !== lastRoomArchivedInformed
    ) {
      setLastRoomArchivedInformed(userGroupJson);
      leaveCall(sessionId, userGroup, userId);
      dispatch(openRoomArchived(userGroup));
    }
  }, [userGroup, lastRoomArchivedInformed, dispatch, sessionId, userId]);

  // --- init ---
  useEffect(() => {
    if (!initCompleted && stateLoaded && participantsJoined && liveGroups) {
      const checkAndProceed = async () => {
        const myUser = await getUserDb(userAuth.uid);
        if (!user && myUser.firstName && myUser.firstName.trim() !== "") {
          // skip profile editing as the user already has a first name
          await updateUser(userAuth.uid, sessionId, myUser);
        } else if (!user) {
          dispatch(setStateLoaded(false));
          history.push(routes.EDIT_PROFILE(), { from: location, sessionId });
          return;
        }
        initFirebasePresenceSync(sessionId, userId, participantsJoined);
        setInitCompleted(true);
        keepAlive(sessionId, userId, userSession);
        dispatch(crossCheckKeepAlives(keepALivesDB));
      };
      checkAndProceed();
    }
  }, [
    initCompleted,
    userId,
    sessionId,
    history,
    stateLoaded,
    keepALivesDB,
    dispatch,
    location,
    userAuth.uid,
    participantsJoined,
    liveGroups,
    user,
    userSession
  ]);

  // --- fire state loaded ---
  useEffect(() => {
    if (
      !stateLoaded &&
      !loadingUsersDB &&
      !loadingSessionDB &&
      !loadingSessionDetailsDB &&
      !loadingParticipantsJoinedDB &&
      !loadingLiveGroupsDB
    ) {
      dispatch(setStateLoaded(true));
    }
  }, [
    stateLoaded,
    loadingUsersDB,
    loadingSessionDB,
    loadingSessionDetailsDB,
    loadingParticipantsJoinedDB,
    loadingLiveGroupsDB,
    dispatch
  ]);

  // --- send keep alive ---
  useInterval(async () => {
    if (stateLoaded) {
      keepAlive(sessionId, userId, userSession);
    }
  }, DEFAULT_KEEP_ALIVE_INTERVAL);

  // --- handle keep alive ---
  useInterval(async () => {
    dispatch(crossCheckKeepAlives(keepALivesDB));
  }, DEFAULT_KEEP_ALIVE_CHECK_INTERVAL);

  // --- loading screen ---
  if (
    loadingUsersDB ||
    loadingSessionDB ||
    loadingSessionDetailsDB ||
    loadingParticipantsJoinedDB ||
    loadingLiveGroupsDB ||
    !initCompleted
  ) {
    return <SplashScreen />;
  }
  if (
    errorUsersDB ||
    errorSessionDB ||
    errorSessionDetailsDB ||
    errorParticipantsJoinedDB ||
    errorLiveGroupsDB
  ) {
    console.error(errorUsersDB);
    console.error(errorSessionDB);
    console.error(errorSessionDetailsDB);
    console.error(errorParticipantsJoinedDB);
    console.error(errorLiveGroupsDB);
    return <p>Error :(</p>; //TODO: improve error msg
  }

  return (
    <JitsiContextProvider>
      <SmallPlayerContextProvider>
        <VerticalNavBarContextWrapper>
          <ChatMessagesContextWrapper>
            <EventSessionContainerTheme>
              <ChatDraftMessageProvider>
                <TechnicalCheckProvider
                  sessionId={sessionId}>
                  <BroadcastMessagesProvider>
                    <PollsContextWrapper>
                      <>
                        <EventSessionContainer />
                        <ParticipantBroadcastDialogContainer />
                      </>
                    </PollsContextWrapper>
                  </BroadcastMessagesProvider>
                </TechnicalCheckProvider>
              </ChatDraftMessageProvider>
            </EventSessionContainerTheme>
          </ChatMessagesContextWrapper>
        </VerticalNavBarContextWrapper>
      </SmallPlayerContextProvider>
    </JitsiContextProvider> 
  );
};

// EventSessionContainer.whyDidYouRender = true;

export default EventSessionContainerWrapper;
