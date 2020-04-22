import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ParticipantCard from "./ParticipantCard";
import { createNewConversation } from "../../Modules/eventSessionOperations";
import { useSnackbar } from "material-ui-snackbar-provider";
import {
  getSessionId,
  getUserId,
  getUserLiveGroup,
  getUserSession,
  getAvailableParticipantsList,
  getLiveGroups,
  getUsers,
} from "../../Redux/eventSession";
import { useSelector, shallowEqual } from "react-redux";
import _ from "lodash";
import Alert from "@material-ui/lab/Alert";
import { MAX_PARTICIPANTS_GROUP } from "../../Config/constants";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    width: theme.breakpoints.values.sm,
    padding: theme.spacing(6),
  },
  closeContainer: {
    position: "absolute",
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
  hintText: {
    marginBottom: theme.spacing(4),
    display: "block",
    width: 400,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2),
  },
  emptySpaceBottom: {
    marginBottom: theme.spacing(4),
  },
  conversationWith: {
    margin: theme.spacing(3, 0),
  },
  participantContainer: {
    margin: theme.spacing(2, 0),
  },
  alert: {
    marginTop: theme.spacing(2),
  },
}));

export default function (props) {
  const classes = useStyles();
  const snackbar = useSnackbar();

  const { open, setOpen, participant, setIsInConferenceRoom } = props;

  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);
  const userGroup = useSelector(getUserLiveGroup, shallowEqual);
  const users = useSelector(getUsers, shallowEqual);
  const userSession = useSelector(getUserSession, shallowEqual);
  const availableParticipantsList = useSelector(getAvailableParticipantsList, shallowEqual);
  const liveGroups = useSelector(getLiveGroups, shallowEqual);

  const participantSession = React.useMemo(
    () => _.find(availableParticipantsList, (p) => participant && p.id === participant.id),
    [availableParticipantsList, participant]
  );

  const liveGroup = React.useMemo(
    () =>
      liveGroups && participantSession && participantSession.groupId ? liveGroups[participantSession.groupId] : null,
    [liveGroups, participantSession]
  );

  const isMyUser = userId && participant && userId === participant.id;

  let participantInConversation = participantSession && participantSession.groupId;
  let userInConferenceRoom = userSession && !userSession.inNetworkingRoom;
  let participantInConferenceRoom = !isMyUser && participantSession && !participantSession.inNetworkingRoom;

  let canStartConversation = !isMyUser && !participantInConversation && !participantInConferenceRoom;
  let canJoinConversation =
    !isMyUser && !participantInConferenceRoom && liveGroup && _.size(liveGroup.participants) <= MAX_PARTICIPANTS_GROUP;

  // console.log({
  //   participantSession,
  //   participantInConversation,
  //   userInConferenceRoom,
  //   participantInConferenceRoom,
  //   canStartConversation,
  //   canJoinConversation,
  // });

  const handleClose = () => {
    setOpen(false);
  };

  if (!participant) {
    return null;
  }

  const startConversation = (e) => {
    e.preventDefault();
    try {
      if (userInConferenceRoom) {
        setIsInConferenceRoom(false);
      }
      createNewConversation(sessionId, userId, participant.id, userGroup, snackbar);
    } catch (error) {
      console.error(error);
    }
    setOpen(false);
  };

  const handleJoinConversation = () => {
    alert("not implemented...");
  };
  console.log(liveGroup);
  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth={"sm"}>
        <div className={classes.content}>
          <ParticipantCard participant={participant} />
          {isMyUser && (
            <Alert severity="info" className={classes.alert}>
              This is yourself{" "}
              <span role="img" aria-label="happy">
                🙂
              </span>
            </Alert>
          )}
          {participantInConversation && (
            <div className={classes.conversationWith}>
              <>
                <Typography variant="button" color="primary">
                  In a conversation with:
                </Typography>
                {/* <Divider color="secondary" /> */}
                {liveGroup &&
                  liveGroup.participants &&
                  Object.values(liveGroup.participants).map((p) => {
                    if (p.id === participant.id) {
                      return null;
                    }
                    let pDetails = users[p.id];
                    if (!pDetails) {
                      return null;
                    }
                    return (
                      <div key={p.id} className={classes.participantContainer}>
                        <ParticipantCard participant={pDetails} />
                      </div>
                    );
                  })}

                {canJoinConversation && (
                  <div>
                    <div className={classes.buttonContainer}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={handleJoinConversation}
                      >
                        Join Conversation
                      </Button>
                    </div>
                    {/* <Typography className={classes.hintText} variant="caption"> */}
                    {!userInConferenceRoom && (
                      <Alert severity="success" className={classes.alert}>
                        You will join this conversation video conferencing call
                      </Alert>
                    )}

                    {/* </Typography> */}
                  </div>
                )}
              </>
            </div>
          )}

          {canStartConversation && (
            <React.Fragment>
              <div className={classes.buttonContainer}>
                <Button variant="contained" color="primary" className={classes.button} onClick={startConversation}>
                  Start Conversation
                </Button>
              </div>
              {/* <Typography className={classes.hintText} variant="caption"> */}
              {!userInConferenceRoom && (
                <Alert severity="success" className={classes.alert}>
                  You will join new a video conferencing call with {participant.firstName}.{/* </Typography> */}
                </Alert>
              )}
            </React.Fragment>
          )}
          {participantInConferenceRoom /* && (canJoinConversation || canStartConversation) */ && (
            <div className={classes.buttonContainer}>
              <Alert severity="warning">
                {participant.firstName} is currently watching the presentation on the main stage and is not available to
                talk
              </Alert>

              {/* </Typography> */}
            </div>
          )}
          {userInConferenceRoom && (canJoinConversation || canStartConversation) && (
            <div className={classes.buttonContainer}>
              {/* <div style={{ textAlign: "center", width: "100%" }}>
                <SuccessIcon style={{ fontSize: 64, color: "#53a653" }} />
              </div> */}
              <Alert severity="warning">
                You are currently watching the presentation on the main stage. <br />
                If you start this conversation you will leave the main stage.
              </Alert>
            </div>
          )}

          {/* {participant.id === user.uid && (
            <React.Fragment>
              <div className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => history.push(routes.EDIT_PROFILE(routes.EVENT_SESSION(eventSession.id)))}
                >
                  Edit profile
                </Button>
              </div>
            </React.Fragment>
          )} */}
          {/* {(onConferenceRoom || participant.id === user.uid) && <div className={classes.emptySpaceBottom}></div>} */}
        </div>
      </Dialog>
    </div>
  );
}
