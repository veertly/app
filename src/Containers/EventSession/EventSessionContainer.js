import React, { useEffect, useState, useMemo } from "react";
// import Layout from "../Layouts/EventSessionLayout";
import {
  useCollectionData,
  useDocumentData
} from "react-firebase-hooks/firestore";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { makeStyles /* useTheme */ } from "@material-ui/styles";
import moment from "moment";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import NetworkingRoomContainer from "./NetworkingRoomContainer";
import firebase from "../../Modules/firebaseApp";
import {
  leaveCall,
  updateInNetworkingRoom
} from "../../Modules/eventSessionOperations";

// import NetworkingSidebar from "./NetworkingSidebar";
import EventSessionTopbar from "../../Components/EventSession/EventSessionTopbar";
import ConferenceRoomContainer from "./ConferenceRoomContainer";
import ConferenceSidebar from "./ConferenceSidebar";
import Page from "../../Components/Core/Page";
import routes from "../../Config/routes";
import {
  initFirebasePresenceSync,
  keepAlive,
  getUserDb,
  updateUser
} from "../../Modules/userOperations";
import Announcements from "../../Components/EventSession/Announcements";
import {
  DEFAULT_EVENT_OPEN_MINUTES,
  DEFAULT_KEEP_ALIVE_INTERVAL,
  DEFAULT_KEEP_ALIVE_CHECK_INTERVAL,
  DEFAULT_EVENT_CLOSES_MINUTES
} from "../../Config/constants";
import SideMenuIcons from "../../Components/EventSession/SideMenuIcons";
import ChatPane, { CHAT_DEFAULT_WIDTH } from "../../Components/Chat/ChatPane";
import EditProfileDialog from "../../Components/EditProfile/EditProfileDialog";
import EventPageDialog from "../../Components/Event/EventPageDialog";
import { isChatOpen, openRoomArchived } from "../../Redux/dialogs";
import ShareEventDialog from "../../Components/Event/ShareEventDialog";
import FeedbackDialog from "../../Components/EventSession/FeedbackDialog";
import RoomArchivedDialog from "../../Components/EventSession/RoomArchivedDialog";
import {
  updateEventSession,
  getEventSessionDetails,
  updateEventSessionDetails,
  updateParticipantsJoined,
  updateLiveGroups,
  updateUsers,
  getUsers,
  getParticipantsJoined,
  getLiveGroups,
  updateUserId,
  getUser,
  getUserSession,
  getUserGroup,
  setStateLoaded,
  isStateLoaded,
  crossCheckKeepAlives,
  setEnabledFeatures,
  getFeatureDetails
} from "../../Redux/eventSession";
import useInterval from "../../Hooks/useInterval";
import JoinParticipantDialog from "../../Components/EventSession/JoinParticipantDialog";
import SplashScreen from "../../Components/Misc/SplashScreen";
import JitsiContext from "./JitsiContext";
import SmallPlayerContainer from "./SmallPlayerContainer";
import {
  SMALL_PLAYER_INITIAL_HEIGHT,
  SMALL_PLAYER_INITIAL_WIDTH
} from "../../Utils";
import { FEATURES } from "../../Modules/features";
import JoinRoomDialog from "../../Components/EventSession/JoinRoomDialog";
import CreateRoomDialog from "../../Components/EventSession/CreateRoomDialog";
import VerticalNavBar from "../../Components/EventSession/VerticalNav/VerticalNavBar";

export const SIDE_PANE_WIDTH = 53;
export const VERTICAL_NAV_WIDTH = 85;

const LEFT_PANE_WIDTH = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64
    },
    position: "relative",
    overflow: "hidden"
  },
  shiftContent: {
    paddingLeft: VERTICAL_NAV_WIDTH + LEFT_PANE_WIDTH
  },

  mainPane: {
    position: "absolute",
    // height: "100%",
    top: 64,
    bottom: 0,
    left: VERTICAL_NAV_WIDTH + LEFT_PANE_WIDTH,
    right: SIDE_PANE_WIDTH,
    backgroundColor: theme.palette.background.default,
    backgroundImage: "url('/Illustrations/EmptyNetworkingPane.svg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "50%",
    backgroundPosition: "bottom right",
    [theme.breakpoints.down("xs")]: {
      right: 0,
      left: 0,
      top: 56
    }
  },
  noCall: {
    width: "100%",
    textAlign: "center",
    position: "absolute",
    // paddingLeft: "20%",
    top: "45%"
  },
  blueText: {
    color: "#274760"
  },
  greenText: {
    color: "#37C470"
  },
  emptyMessage: {
    // fontWeight: 500,
    width: 370,
    margin: "auto",
    textAlign: "left",
    maxWidth: "100%",
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(0, 1)
    }
  },
  sideMenu: {
    width: SIDE_PANE_WIDTH,
    top: 64,
    backgroundColor: "white",
    position: "absolute",
    right: 0,
    bottom: 0,
    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  verticalNav: {
    width: VERTICAL_NAV_WIDTH,
    top: 64,
    backgroundColor: "white",
    position: "absolute",
    left: 0,
    bottom: 0,
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  smallPlayerContainer: {
    position: "absolute",
    bottom: 0,
    // left: 0,
    right: SIDE_PANE_WIDTH,
    zIndex: 1201,
    height: SMALL_PLAYER_INITIAL_HEIGHT,
    width: SMALL_PLAYER_INITIAL_WIDTH,
    padding: theme.spacing(1)
    // borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  }
}));

const EventSessionContainer = (props) => {
  const dispatch = useDispatch();

  const [userAuth] = useAuthState(firebase.auth());

  const [initCompleted, setInitCompleted] = useState(false);

  const [jitsiApi, setJitsiApi] = useState(null);

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = !useMediaQuery(theme.breakpoints.down("xs"));

  const [openSidebar, setOpenSidebar] = useState(false);
  const history = useHistory();

  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);

  const chatOpen = useSelector(isChatOpen);

  const location = useLocation();

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  const { sessionId: originalSessionId } = useParams();

  const sessionId = useMemo(
    () => (originalSessionId ? originalSessionId.toLowerCase() : null),
    [originalSessionId]
  );
  const userId = useMemo(() => (userAuth ? userAuth.uid : null), [userAuth]);

  const [showSmallPlayer, setShowSmallPlayer] = useState(true);

  const [miniPlayerEnabled, setMiniPlayerEnabled] = useState(false);

  const [lastEventSessionDBJson, setLastEventSessionDBJson] = useState("");
  const [
    lastEventSessionDetailsDBJson,
    setLastEventSessionDetailsDBJson
  ] = useState("");

  const [lastParticipantsJoinedDB, setLastParticipantsJoinedDB] = useState("");
  const [lastLiveGroupsDB, setLastLiveGroupsDB] = useState("");
  const [lastUsersDB, setLastUsersDB] = useState("");
  const [
    lastEventSessionsEnabledFeaturesDB,
    setLastEventSessionsEnabledFeaturesDB
  ] = useState("");

  // const eventSession = useSelector(getEventSession, shallowEqual);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  const participantsJoined = useSelector(getParticipantsJoined, shallowEqual);
  const liveGroups = useSelector(getLiveGroups, shallowEqual);
  const users = useSelector(getUsers, shallowEqual);
  const miniPlayerFeature = useSelector(
    getFeatureDetails(FEATURES.MINI_PLAYER),
    shallowEqual
  );

  const user = useSelector(getUser, shallowEqual);
  const userSession = useSelector(getUserSession, shallowEqual);
  const userGroup = useSelector(getUserGroup, shallowEqual);
  const [
    lastRoomArchivedInformed,
    setLastRoomArchivedInformed
  ] = React.useState(null);

  const stateLoaded = useSelector(isStateLoaded);

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

  const isInConferenceRoom = useMemo(
    () => userSession && !userSession.inNetworkingRoom,
    [userSession]
  );

  const [eventSessionDB, loadingSessionDB, errorSessionDB] = useDocumentData(
    firebase.firestore().collection("eventSessions").doc(sessionId)
  );

  const [
    eventSessionDetailsDB,
    loadingSessionDetailsDB,
    errorSessionDetailsDB
  ] = useDocumentData(
    firebase.firestore().collection("eventSessionsDetails").doc(sessionId)
  );

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

  const [keepALivesDB] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("keepAlive"),
    { idField: "id" }
  );

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

  const [usersDB, loadingUsersDB, errorUsersDB] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsDetails")
  );

  const [eventSessionsEnabledFeaturesDB] = useDocumentData(
    firebase
      .firestore()
      .collection("eventSessionsEnabledFeatures")
      .doc(sessionId)
  );

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

  useEffect(() => {
    if (miniPlayerFeature) {
      setMiniPlayerEnabled(miniPlayerFeature.enabled);
    }
  }, [miniPlayerFeature]);

  // --- userId ---
  useEffect(() => {
    dispatch(updateUserId(userId));
  }, [userId, dispatch]);

  // --- eventSessionDB ---
  useEffect(() => {
    const currentEventSessionDBJson = JSON.stringify(eventSessionDB);

    if (lastEventSessionDBJson !== currentEventSessionDBJson) {
      dispatch(updateEventSession(eventSessionDB));
      setLastEventSessionDBJson(currentEventSessionDBJson);
    }
  }, [eventSessionDB, lastEventSessionDBJson, dispatch]);

  // --- eventSessionDetailsDB ---
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
  useEffect(() => {
    const currentParticipantsJoinedDB = JSON.stringify(participantsJoinedDB);

    if (lastParticipantsJoinedDB !== currentParticipantsJoinedDB) {
      dispatch(updateParticipantsJoined(participantsJoinedDB));
      setLastParticipantsJoinedDB(currentParticipantsJoinedDB);
    }
  }, [participantsJoinedDB, lastParticipantsJoinedDB, dispatch]);

  // --- liveGroupsDB ---
  useEffect(() => {
    const currentLiveGroupsDB = JSON.stringify(liveGroupsDB);

    if (lastLiveGroupsDB !== currentLiveGroupsDB) {
      dispatch(updateLiveGroups(liveGroupsDB));
      setLastLiveGroupsDB(currentLiveGroupsDB);
    }
  }, [liveGroupsDB, lastLiveGroupsDB, dispatch]);

  // --- usersDB ---
  useEffect(() => {
    const currentUsersDB = JSON.stringify(usersDB);

    if (lastUsersDB !== currentUsersDB) {
      dispatch(updateUsers(usersDB));
      setLastUsersDB(currentUsersDB);
    }
  }, [usersDB, lastUsersDB, dispatch]);

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
    liveGroups,
    participantsJoined,
    users,
    userId,
    sessionId,
    history,
    user,
    stateLoaded,
    userSession,
    keepALivesDB,
    dispatch,
    location,
    userAuth.uid
  ]);

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

  // -----------------------------------------------------------------------------------------------------

  const handleCreateConference = React.useCallback(() => {
    history.push(routes.CREATE_EVENT_SESSION());
  }, [history]);

  const isLive = React.useMemo(() => {
    if (
      !eventSessionDetails ||
      !eventSessionDetails.eventBeginDate ||
      !eventSessionDetails.eventOpens ||
      !eventSessionDetails.eventEndDate ||
      !eventSessionDetails.eventCloses
    ) {
      return true;
    }
    const {
      eventBeginDate,
      eventOpens,
      eventEndDate,
      eventCloses
    } = eventSessionDetails;

    const openMinutes = eventOpens
      ? Number(eventOpens)
      : DEFAULT_EVENT_OPEN_MINUTES;
    const beginDate = moment(eventBeginDate.toDate());

    let closeMinutes = eventCloses
      ? Number(eventCloses)
      : DEFAULT_EVENT_CLOSES_MINUTES;
    let endDate = moment(eventEndDate.toDate());

    return (
      beginDate.subtract(openMinutes, "minutes").isBefore(moment()) &&
      endDate.add(closeMinutes, "minutes").isAfter(moment())
    );
  }, [eventSessionDetails]);

  useEffect(() => {
    if (!isLive) {
      history.push(routes.EVENT_SESSION(sessionId));
    }
  }, [isLive, history, sessionId]);

  const smallPlayerBounds = React.useMemo(() => `.${classes.root}`, [
    classes.root
  ]);

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
    return <p>Error :(</p>;
  }

  const handleSetIsInConferenceRoom = (openConference) => {
    if (openConference) {
      if (userGroup) {
        leaveCall(sessionId, userGroup, userId);
        if (jitsiApi) {
          jitsiApi.executeCommand("hangup");
          jitsiApi.dispose();
        }
      }
      // setIsInConferenceRoom(true);
      updateInNetworkingRoom(sessionId, userId, false);
    } else {
      if (jitsiApi) {
        jitsiApi.executeCommand("hangup");
        jitsiApi.dispose();
      }
      // setIsInConferenceRoom(false);
      updateInNetworkingRoom(sessionId, userId, true);
    }
  };

  if (!eventSessionDetails) {
    return (
      <Page title="Veertly | Event not found">
        <div
          className={clsx({
            [classes.root]: true,
            [classes.shiftContent]: false
          })}
        >
          <EventSessionTopbar
            isInConferenceRoom={isInConferenceRoom}
            setIsInConferenceRoom={handleSetIsInConferenceRoom}
            // isInNetworkingCall={currentGroupId !== null}
            // isNetworkingAvailable={false}
            // eventSession={eventSession}
            // myUser={myUser}
          />
          <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Typography
              align="center"
              variant="overline"
              style={{ display: "block" }}
            >
              Event not found!
            </Typography>
            {/* {user && !user.isAnonymous && ( */}
            <div style={{ width: "100%", textAlign: "center", marginTop: 16 }}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleCreateConference}
              >
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <JitsiContext.Provider
      value={{
        jitsiApi,
        setJitsiApi,
        showSmallPlayer,
        setShowSmallPlayer,
        miniPlayerEnabled
      }}
    >
      <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: isDesktop
        })}
      >
        <Page title={`Veertly | ${eventSessionDetails.title}`}> </Page>
        <EditProfileDialog /* user={user} eventSession={composedEventSession}  */
        />
        <EventPageDialog /* eventSession={composedEventSession}  */ />
        <ShareEventDialog /*  eventSession={composedEventSession}  */ />
        <FeedbackDialog /* eventSession={composedEventSession} myUser={myUser}  */
        />
        <JoinParticipantDialog
          setIsInConferenceRoom={handleSetIsInConferenceRoom}
        />
        <JoinRoomDialog setIsInConferenceRoom={handleSetIsInConferenceRoom} />
        <CreateRoomDialog />
        <RoomArchivedDialog />

        <EventSessionTopbar
          isInConferenceRoom={isInConferenceRoom}
          setIsInConferenceRoom={handleSetIsInConferenceRoom}
        />
        {isLive && (
          <>
            <div className={classes.verticalNav}>
              <VerticalNavBar /* eventSession={composedEventSession} user={user}  */
              />
            </div>
            {/* NETWORKING PANE */}
            {!isInConferenceRoom && (
              <>
                {/* <NetworkingSidebar
                  onClose={handleSidebarClose}
                  open={shouldOpenSidebar}
                  variant={isDesktop ? "persistent" : "temporary"}
                  setIsInConferenceRoom={handleSetIsInConferenceRoom}
                /> */}
                <div
                  className={classes.mainPane}
                  style={
                    chatOpen ? { right: SIDE_PANE_WIDTH + chatWidth } : null
                  }
                >
                  {!userGroup && (
                    <div className={classes.noCall}>
                      <Typography
                        variant="h6"
                        className={clsx(classes.blueText, classes.emptyMessage)}
                      >
                        You are not in any{" "}
                        <span className={classes.greenText}>conversation</span>{" "}
                        yet,
                        <br />
                        don't be shy and{" "}
                        <span className={classes.greenText}>
                          select someone
                        </span>{" "}
                        to <span className={classes.greenText}>talk</span> to!
                      </Typography>
                    </div>
                  )}
                  {userGroup && (
                    <NetworkingRoomContainer
                      jitsiApi={jitsiApi}
                      setJitsiApi={setJitsiApi}
                    />
                  )}
                </div>
                {/* <div className={classes.smallPlayerContainer}> */}
                <SmallPlayerContainer bounds={smallPlayerBounds} />
                {/* </div> */}
              </>
            )}
            {/* CONFERENCE PANE */}
            {isInConferenceRoom && (
              <>
                <ConferenceSidebar
                  onClose={handleSidebarClose}
                  open={shouldOpenSidebar}
                  variant={isDesktop ? "persistent" : "temporary"}
                  setIsInConferenceRoom={handleSetIsInConferenceRoom}
                />

                <div
                  className={classes.mainPane}
                  style={
                    chatOpen ? { right: SIDE_PANE_WIDTH + chatWidth } : null
                  }
                >
                  <Announcements /* eventSession={composedEventSession} */ />
                  <ConferenceRoomContainer
                  // user={user}
                  // eventSession={composedEventSession}
                  // participantsJoined={participantsJoined}
                  // liveGroups={liveGroups}
                  // jitsiApi={jitsiApi}
                  // setJitsiApi={setJitsiApi}
                  />
                </div>
              </>
            )}
            <div className={classes.sideMenu}>
              <SideMenuIcons /* eventSession={composedEventSession} user={user}  */
              />
            </div>

            {/* <div
            className={clsx(classes.chatPane, {
              [classes.hide]: !chatOpen,
            })}
          >
            {`chat open: ${chatOpen ? "true" : "false"}`} */}
            <ChatPane
              /* eventSession={composedEventSession} users={users} user={user} */
              onResize={(w) => setChatWidth(w)}
            />
            {/* </div> */}
          </>
        )}
      </div>
    </JitsiContext.Provider>
  );
};

// EventSessionContainer.whyDidYouRender = true;

export default EventSessionContainer;
