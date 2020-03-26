import React, { useEffect, useState } from "react";
// import Layout from "../Layouts/EventSessionLayout";
import NetworkingRoomContainer from "./NetworkingRoomContainer";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import firebase from "../../Modules/firebaseApp";
import { withRouter } from "react-router-dom";
import {
  setAsAvailable,
  setAsOffline,
  leaveCall,
  updateInNetworkingRoom,
  createConference
} from "../../Modules/eventSessionOperations";
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

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64
    },
    position: "relative"
  },
  shiftContent: {
    paddingLeft: 300
  },

  mainPane: {
    position: "relative",
    height: "100%",
    backgroundColor: theme.palette.background.default
  },
  noCall: {
    width: "100%",
    textAlign: "center",
    position: "absolute",
    top: "30%"
  }
}));

export default withRouter(props => {
  const [usersFirebase, loadingUsers, errorUsers] = useCollectionData(firebase.firestore().collection("users"));
  const [user /* , initialising, error */] = useAuthState(firebase.auth());

  const [initCompleted, setInitCompleted] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [jitsiApi, setJitsiApi] = useState(null);
  // const [liveAt, setLiveAt] = useState(null);
  const [lastEventSessionJson, setLastEventSessionJson] = useState("");
  const [lastParticipantJoinedJson, setLastParticipantJoinedJson] = useState("");
  const [lastLiveGroupsJson, setLastLiveGroupsJson] = useState("");
  const [composedEventSession, setComposedEventSession] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const userId = user ? user.uid : null;

  let [isInConferenceRoom, setIsInConferenceRoom] = useState(false);

  let { sessionId } = props.match.params;
  if (!sessionId) {
    sessionId = "session123";
  }
  const classes = useStyles();
  // const theme = useTheme();
  const isDesktop = true;
  // useMediaQuery(theme.breakpoints.up("xs"), {
  //   defaultMatches: true
  // });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;
  useBeforeunload(e => {
    setAsOffline(composedEventSession, userId);
  });

  const [eventSession, loadingSession, errorSession] = useDocumentData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
  );
  const [participantsJoined, loadingParticipantsJoined, errorParticipantsJoined] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsJoined"),
    { idField: "id" }
  );
  const [liveGroups, loadingLiveGroups, errorLiveGroups] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("liveGroups"),
    { idField: "idField" }
  );

  useEffect(() => {
    const currentEventSessionJson = JSON.stringify(eventSession);
    const currentParticipantsJoinedJson = JSON.stringify(participantsJoined);
    const currentLiveGroupsJson = JSON.stringify(liveGroups);

    if (
      currentEventSessionJson !== lastEventSessionJson ||
      currentParticipantsJoinedJson !== lastParticipantJoinedJson ||
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

      // console.lo({ composedEventSession });
      // console.lo({ eventSession });
      // console.lo("ON effect to set composedEventSession");

      if (eventSession) {
        let tempComposedEventSession = {
          ...eventSession,
          participantsJoined: participantsJoinedMap,
          liveGroups: liveGroupsMap
        };
        setComposedEventSession(tempComposedEventSession);
        if (!initCompleted && liveGroups && participantsJoined) {
          // console.lo({ eventSession });
          // console.lo("ON effect to set as available...");
          setAsAvailable(tempComposedEventSession, userId);
          setInitCompleted(true);
        }
      }

      if (eventSession && participantsJoined && liveGroups) {
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
      setLastLiveGroupsJson(currentLiveGroupsJson);
      setLastParticipantJoinedJson(currentParticipantsJoinedJson);
      //console.lo("-----> UPDATING JSON variables....");
    }
  }, [eventSession, participantsJoined, liveGroups]);

  const handleCreateConference = async () => {
    if (!user.isAnonymous) {
      setCreatingEvent(true);
      await createConference(sessionId, userId);
      setCreatingEvent(false);
    }
  };

  let users = {};
  if (usersFirebase) {
    users = usersFirebase.reduce((result, user) => {
      result[user.id] = user;
      return result;
    }, {});
  }
  if (loadingUsers || loadingSession || loadingParticipantsJoined || loadingLiveGroups) {
    return <p>Loading...</p>;
  }
  if (errorUsers || errorSession || errorParticipantsJoined || errorLiveGroups) {
    console.error(errorUsers);
    console.error(errorSession);
    console.error(errorParticipantsJoined);
    console.error(errorLiveGroups);
    return <p>Error :(</p>;
  }
  // console.log(users);
  // console.log(composedEventSession);
  // console.log(participantsJoined);
  // console.log(liveGroups);

  const handleSetIsInConferenceRoom = openConference => {
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
      <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: false
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
            Conference room not found!
          </Typography>
          {user && !user.isAnonymous && (
            <div style={{ width: "100%", textAlign: "center", marginTop: 16 }}>
              <Button variant="contained" color="secondary" className={classes.button} onClick={handleCreateConference}>
                Create Conference {sessionId}
              </Button>
            </div>
          )}

          {user && user.isAnonymous && (
            <div style={{ width: "100%", textAlign: "center", marginTop: 16 }}>
              <Typography variant="caption" align="center">
                You are connected as a guest, if you want to create an event, please login using your email
              </Typography>
            </div>
          )}

          {creatingEvent && (
            <Typography variant="caption" align="center">
              Creating conference...
            </Typography>
          )}
        </div>
      </div>
    );
  }

  // console.log({ now: new Date().getTime(), liveAt: eventSession.liveAt });
  let isLive = composedEventSession.liveAt ? new Date().getTime() / 1000 > composedEventSession.liveAt : true;
  // console.lo({ composedEventSession });

  console.log({ currentGroup });
  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <EventSessionTopbar
        isInConferenceRoom={isInConferenceRoom}
        setIsInConferenceRoom={handleSetIsInConferenceRoom}
        isInNetworkingCall={currentGroupId !== null}
        isNetworkingAvailable={composedEventSession.isNetworkingAvailable}
        eventSession={eventSession}
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
                // participantsJoined={participantsJoined}
                // liveGroups={liveGroups}
                currentGroup={currentGroup}
                user={user}
              />
              <div className={classes.mainPane}>
                {!currentGroup && (
                  <div className={classes.noCall}>
                    <Typography variant="body2">
                      You are not yet in any conversation,
                      <br />
                      don't be shy and select someone to talk to!
                    </Typography>
                  </div>
                )}
                {currentGroup && (
                  <NetworkingRoomContainer
                    currentGroup={currentGroup}
                    user={user}
                    eventSession={composedEventSession}
                    // participantsJoined={participantsJoined}
                    // liveGroups={liveGroups}
                    jitsiApi={jitsiApi}
                    setJitsiApi={setJitsiApi}
                  />
                )}
              </div>
            </React.Fragment>
          )}
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
        </React.Fragment>
      )}
    </div>
  );
});
