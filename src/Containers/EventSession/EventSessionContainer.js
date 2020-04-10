import React, { useEffect, useState } from "react";
// import Layout from "../Layouts/EventSessionLayout";
import NetworkingRoomContainer from "./NetworkingRoomContainer";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import firebase from "../../Modules/firebaseApp";
import { withRouter } from "react-router-dom";
import { setAsAvailable, leaveCall, updateInNetworkingRoom } from "../../Modules/eventSessionOperations";
import { useAuthState } from "react-firebase-hooks/auth";
import Typography from "@material-ui/core/Typography";
import { useBeforeunload } from "react-beforeunload";
import clsx from "clsx";

import { makeStyles /* useTheme */ } from "@material-ui/styles";
// import { useMediaQuery } from "@material-ui/core";
import NetworkingSidebar from "./NetworkingSidebar";
import EventSessionTopbar from "../../Components/EventSession/EventSessionTopbar";
import ConferenceRoomContainer from "./ConferenceRoomContainer";
import ConferenceSidebar from "./ConferenceSidebar";
import moment from "moment";
import Button from "@material-ui/core/Button";
import Page from "../../Components/Core/Page";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import routes from "../../Config/routes";
import { initFirebasePresenceSync } from "../../Modules/userOperations";
import Announcements from "../../Components/EventSession/Announcements";
import { DEFAULT_EVENT_OPEN_MINUTES } from "../../Config/constants";
import SideMenuIcons from "../../Components/SideMenu/SideMenuIcons";
import ChatPane from "../../Components/SideMenu/ChatPane";
import EditProfileDialog from "../../Components/EditProfile/EditProfileDialog";
import { useSelector } from "react-redux";
import { isChatOpen, isEventDetailsOpen } from "../../Redux/selectors";
import EventPageDialog from "../../Components/EventShow/EventPageDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64,
    },
    position: "relative",
  },
  shiftContent: {
    paddingLeft: 300,
  },

  mainPane: {
    position: "relative",
    height: "100%",
    backgroundColor: theme.palette.background.default,
    backgroundImage: "url('/Illustrations/EmptyNetworkingPane.svg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "50%",
    backgroundPosition: "bottom right",
    right: 53,
    [theme.breakpoints.down("xs")]: {
      right: 0,
    },
  },
  noCall: {
    width: "100%",
    textAlign: "center",
    position: "absolute",
    // paddingLeft: "20%",
    top: "45%",
  },
  blueText: {
    color: "#274760",
  },
  greenText: {
    color: "#37C470",
  },
  emptyMessage: {
    // fontWeight: 500,
    width: 340,
    margin: "auto",
    textAlign: "left",
  },
  sideMenu: {
    width: 53,
    top: 64,
    backgroundColor: "white",
    position: "absolute",
    right: 0,
    bottom: 0,
    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));

export default withRouter((props) => {
  const [user /* , initialising, error */] = useAuthState(firebase.auth());

  const [initCompleted, setInitCompleted] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [jitsiApi, setJitsiApi] = useState(null);
  // const [liveAt, setLiveAt] = useState(null);
  const [lastEventSessionJson, setLastEventSessionJson] = useState("");
  const [lastEventSessionDetailsJson, setLastEventSessionDetailsJson] = useState("");
  const [lastParticipantJoinedJson, setLastParticipantJoinedJson] = useState("");
  const [lastParticipantDetailsJson, setLastParticipantDetailsJson] = useState("");
  const [lastLiveGroupsJson, setLastLiveGroupsJson] = useState("");
  const [composedEventSession, setComposedEventSession] = useState(null);
  const userId = user ? user.uid : null;

  let [isInConferenceRoom, setIsInConferenceRoom] = useState(false);

  let originalSessionId = props.match.params.sessionId;

  let sessionId = originalSessionId ? originalSessionId.toLowerCase() : null;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = !useMediaQuery(theme.breakpoints.down("xs"));

  const [openSidebar, setOpenSidebar] = useState(false);
  const history = useHistory();
  const detailsOpen = useSelector(isEventDetailsOpen);

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;
  useBeforeunload((e) => {
    // setAsOffline(composedEventSession, userId);
  });

  const [eventSession, loadingSession, errorSession] = useDocumentData(
    firebase.firestore().collection("eventSessions").doc(sessionId)
  );
  const [eventSessionDetails, loadingSessionDetails, errorSessionDetails] = useDocumentData(
    firebase.firestore().collection("eventSessionsDetails").doc(sessionId)
  );
  const [
    participantsJoined,
    loadingParticipantsJoined,
    errorParticipantsJoined,
  ] = useCollectionData(
    firebase.firestore().collection("eventSessions").doc(sessionId).collection("participantsJoined"),
    { idField: "id" }
  );
  const [liveGroups, loadingLiveGroups, errorLiveGroups] = useCollectionData(
    firebase.firestore().collection("eventSessions").doc(sessionId).collection("liveGroups"),
    { idField: "idField" }
  );

  const [usersFirebase, loadingUsers, errorUsers] = useCollectionData(
    firebase.firestore().collection("eventSessions").doc(sessionId).collection("participantsDetails")
  );

  useEffect(() => {
    const currentEventSessionJson = JSON.stringify(eventSession);
    const currentEventSessionDetailsJson = JSON.stringify(eventSessionDetails);
    const currentParticipantsJoinedJson = JSON.stringify(participantsJoined);
    const currentLiveGroupsJson = JSON.stringify(liveGroups);
    const currentParticipantsDetailsJson = JSON.stringify(usersFirebase);

    if (
      currentEventSessionJson !== lastEventSessionJson ||
      currentEventSessionDetailsJson !== lastEventSessionDetailsJson ||
      currentParticipantsJoinedJson !== lastParticipantJoinedJson ||
      currentParticipantsDetailsJson !== lastParticipantDetailsJson ||
      currentLiveGroupsJson !== lastLiveGroupsJson
    ) {
      // console.lo({ participantsJoined });
      // console.lo({ liveGroups });

      // check if I am the last one in a group
      // remove from the group
      // If not in a group:
      // check if I have been invited to a conversation
      // if so, choose one of the invites and join it. Reject all the other ones

      const participantsJoinedMap = participantsJoined
        ? participantsJoined.reduce((result, participantJoinedObj) => {
            let id = participantJoinedObj.id;
            result[id] = participantJoinedObj;
            return result;
          }, {})
        : {};

      const liveGroupsMap = liveGroups
        ? liveGroups.reduce((result, group) => {
            let id = group.idField;
            result[id] = group;
            return result;
          }, {})
        : {};

      if (eventSession && eventSessionDetails && usersFirebase) {
        let tempComposedEventSession = {
          ...eventSession,
          ...eventSessionDetails,
          participantsJoined: participantsJoinedMap,
          liveGroups: liveGroupsMap,
        };
        setComposedEventSession(tempComposedEventSession);
        if (!initCompleted && liveGroups && participantsJoined) {
          if (!usersFirebase.find((item) => item.id === userId)) {
            history.push(routes.EDIT_PROFILE(routes.EVENT_SESSION_LIVE(sessionId)));
          }
          // console.lo({ eventSession });
          // console.lo("ON effect to set as available...");
          setAsAvailable(tempComposedEventSession, userId);
          initFirebasePresenceSync(tempComposedEventSession.id, userId);
          setInitCompleted(true);
        }
      }

      if (eventSession && eventSessionDetails && participantsJoined && liveGroups) {
        // console.lo("....WILL UPDATE EVENT SESSION.....");
        let userEventSession = participantsJoinedMap[userId];
        //console.log({ userEventSession });
        if (userEventSession) {
          let { groupId } = userEventSession;
          setIsInConferenceRoom(!userEventSession.inNetworkingRoom);

          if (!groupId && currentGroupId) {
            setCurrentGroup(null);
            setCurrentGroupId(null);
          } else {
            let group = liveGroupsMap[groupId];

            // has the group changed?
            if (JSON.stringify(currentGroup) !== JSON.stringify(group)) {
              let group = liveGroupsMap[groupId];
              if (!group) {
                console.log("Was not able to find the group with the id " + groupId);
              }

              console.log("Group is different, will update it...");
              console.log({ currentGroup, group });
              setCurrentGroup(group);
              setCurrentGroupId(groupId);
              // setLiveAt(eventSession.liveAt);
            }
          }
        }
      }

      setLastEventSessionJson(currentEventSessionJson);
      setLastEventSessionDetailsJson(currentEventSessionDetailsJson);
      setLastLiveGroupsJson(currentLiveGroupsJson);
      setLastParticipantJoinedJson(currentParticipantsJoinedJson);
      setLastParticipantDetailsJson(currentParticipantsDetailsJson);
    }
  }, [
    eventSession,
    eventSessionDetails,
    participantsJoined,
    liveGroups,
    currentGroup,
    currentGroupId,
    history,
    initCompleted,
    lastEventSessionDetailsJson,
    lastEventSessionJson,
    lastLiveGroupsJson,
    lastParticipantDetailsJson,
    lastParticipantJoinedJson,
    sessionId,
    userId,
    usersFirebase,
  ]);

  const handleCreateConference = async () => {
    history.push(routes.CREATE_EVENT_SESSION());
  };

  const isLive = React.useMemo(() => {
    if (!composedEventSession || !composedEventSession.eventBeginDate || !composedEventSession.eventOpens) {
      return true;
    }
    const { eventBeginDate, eventOpens } = composedEventSession;
    let openMinutes = eventOpens ? Number(eventOpens) : DEFAULT_EVENT_OPEN_MINUTES;
    let beginDate = moment(eventBeginDate.toDate());

    return beginDate.subtract(openMinutes, "minutes").isBefore(moment());
  }, [composedEventSession]);

  useEffect(() => {
    if (!isLive) {
      history.push(routes.EVENT_SESSION(sessionId));
    }
  }, [isLive, history, sessionId]);

  const users = React.useMemo(() => {
    if (!usersFirebase) {
      return {};
    }
    return usersFirebase.reduce((result, user) => {
      result[user.id] = user;
      return result;
    }, {});
  }, [usersFirebase]);

  if (loadingUsers || loadingSession || loadingSessionDetails || loadingParticipantsJoined || loadingLiveGroups) {
    return <p>Loading...</p>;
  }
  if (errorUsers || errorSession || errorSessionDetails || errorParticipantsJoined || errorLiveGroups) {
    console.error(errorUsers);
    console.error(errorSession);
    console.error(errorSessionDetails);
    console.error(errorParticipantsJoined);
    console.error(errorLiveGroups);
    return <p>Error :(</p>;
  }
  // console.log(users);
  // console.log(composedEventSession);
  // console.log(participantsJoined);
  // console.log(liveGroups);

  const handleSetIsInConferenceRoom = (openConference) => {
    if (openConference) {
      if (currentGroupId) {
        leaveCall(composedEventSession, userId);
        if (jitsiApi) {
          jitsiApi.executeCommand("hangup");
          jitsiApi.dispose();
        }
      }
      setIsInConferenceRoom(true);
      updateInNetworkingRoom(composedEventSession, userId, false);
    } else {
      if (jitsiApi) {
        jitsiApi.executeCommand("hangup");
        jitsiApi.dispose();
      }
      setIsInConferenceRoom(false);
      updateInNetworkingRoom(composedEventSession, userId, true);
    }
  };

  if (!composedEventSession) {
    return (
      <Page title={`Veertly | Event not found`}>
        <div
          className={clsx({
            [classes.root]: true,
            [classes.shiftContent]: false,
          })}
        >
          <EventSessionTopbar
            isInConferenceRoom={isInConferenceRoom}
            setIsInConferenceRoom={handleSetIsInConferenceRoom}
            isInNetworkingCall={currentGroupId !== null}
            isNetworkingAvailable={false}
            eventSession={eventSession}
          />
          <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Typography align="center" variant="overline" style={{ display: "block" }}>
              Event not found!
            </Typography>
            {/* {user && !user.isAnonymous && ( */}
            <div style={{ width: "100%", textAlign: "center", marginTop: 16 }}>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleCreateConference}>
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  // console.log({ now: new Date().getTime(), liveAt: eventSession.liveAt });
  // let isLive = composedEventSession.liveAt ? new Date().getTime() / 1000 > composedEventSession.liveAt : true;

  // console.log({ composedEventSession });

  // console.log({ currentGroup });
  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop,
      })}
    >
      <Page title={`Veertly | ${composedEventSession.title}`}> </Page>
      <EditProfileDialog user={user} eventSession={composedEventSession} />
      <EventPageDialog eventSession={composedEventSession} />

      <EventSessionTopbar
        isInConferenceRoom={isInConferenceRoom}
        setIsInConferenceRoom={handleSetIsInConferenceRoom}
        isInNetworkingCall={currentGroupId !== null}
        isNetworkingAvailable={composedEventSession.isNetworkingAvailable}
        eventSession={composedEventSession}
      />
      {!isLive && (
        <div style={{ marginLeft: -300 }}>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Typography align="center" variant="overline" style={{ display: "block" }}>
            This event is not live yet!
          </Typography>
          <Typography align="center" variant="overline" style={{ display: "block" }}>
            {moment.unix(composedEventSession.liveAt).fromNow()}
          </Typography>
        </div>
      )}
      {isLive && (
        <React.Fragment>
          {/* NETWORKING PANE */}
          {!isInConferenceRoom && (
            <React.Fragment>
              <NetworkingSidebar
                onClose={handleSidebarClose}
                open={shouldOpenSidebar}
                variant={isDesktop ? "persistent" : "temporary"}
                users={users}
                eventSession={composedEventSession}
                currentGroup={currentGroup}
                user={user}
              />
              <div className={classes.mainPane}>
                {!currentGroup && (
                  <div className={classes.noCall}>
                    <Typography variant="h6" className={clsx(classes.blueText, classes.emptyMessage)}>
                      You are not yet in any <span className={classes.greenText}>conversation</span>,
                      <br />
                      don't be shy and <span className={classes.greenText}>select someone</span> to{" "}
                      <span className={classes.greenText}>talk</span> to!
                    </Typography>
                  </div>
                )}
                {currentGroup && (
                  <NetworkingRoomContainer
                    currentGroup={currentGroup}
                    user={user}
                    eventSession={composedEventSession}
                    jitsiApi={jitsiApi}
                    setJitsiApi={setJitsiApi}
                  />
                )}
              </div>
            </React.Fragment>
          )}
          {/* CONFERENCE PANE */}
          {isInConferenceRoom && (
            <React.Fragment>
              <ConferenceSidebar
                onClose={handleSidebarClose}
                open={shouldOpenSidebar}
                variant={isDesktop ? "persistent" : "temporary"}
                users={users}
                eventSession={composedEventSession}
                // participantsJoined={participantsJoined}
                // liveGroups={liveGroups}
                user={user}
              />

              <div className={classes.mainPane}>
                <Announcements eventSession={composedEventSession} />
                <ConferenceRoomContainer
                  user={user}
                  eventSession={composedEventSession}
                  // participantsJoined={participantsJoined}
                  // liveGroups={liveGroups}
                  jitsiApi={jitsiApi}
                  setJitsiApi={setJitsiApi}
                />
              </div>
            </React.Fragment>
          )}
          <div className={classes.sideMenu}>
            <SideMenuIcons eventSession={eventSession} user={user} />
          </div>
          {/* <div
            className={clsx(classes.chatPane, {
              [classes.hide]: !chatOpen,
            })}
          >
            {`chat open: ${chatOpen ? "true" : "false"}`} */}
          <ChatPane eventSession={eventSession} user={user} />
          {/* </div> */}
        </React.Fragment>
      )}
    </div>
  );
});
