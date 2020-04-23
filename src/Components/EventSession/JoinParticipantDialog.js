import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ParticipantCard from "./ParticipantCard";
import { createNewConversation, joinConversation } from "../../Modules/eventSessionOperations";
import { useSnackbar } from "material-ui-snackbar-provider";
import {
  getSessionId,
  getUserId,
  getUserLiveGroup,
  getUserSession,
  getAvailableParticipantsList,
  getLiveGroups,
  getUsers,
  getParticipantsJoined,
} from "../../Redux/eventSession";
import { isJoinParticipantOpen, closeJoinParticipant, getJoinParticipantEntity } from "../../Redux/dialogs";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
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
    textAlign: "left",
  },
}));

export default function (props) {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();

  const { setIsInConferenceRoom } = props;

  const open = useSelector(isJoinParticipantOpen);
  const participant = useSelector(getJoinParticipantEntity, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);
  const userGroup = useSelector(getUserLiveGroup, shallowEqual);
  const users = useSelector(getUsers, shallowEqual);
  const userSession = useSelector(getUserSession, shallowEqual);
  const availableParticipantsList = useSelector(getAvailableParticipantsList, shallowEqual);
  const liveGroups = useSelector(getLiveGroups, shallowEqual);
  const participantsJoined = useSelector(getParticipantsJoined, shallowEqual);

  const participantSession = React.useMemo(
    () => _.find(availableParticipantsList, (p) => participant && p.id === participant.id),
    [availableParticipantsList, participant]
  );

  const liveGroup = React.useMemo(
    () =>
      liveGroups && participantSession && participantSession.groupId ? liveGroups[participantSession.groupId] : null,
    [liveGroups, participantSession]
  );

  const isMyGroup = React.useMemo(() => liveGroup && _.find(liveGroup.participants, (p) => p.id === userId), [
    liveGroup,
    userId,
  ]);
  const isMyUser = userId && participant && userId === participant.id;

  let participantInConversation = participantSession && participantSession.groupId;
  let userInConferenceRoom = userSession && !userSession.inNetworkingRoom;
  let participantInConferenceRoom = !isMyUser && participantSession && !participantSession.inNetworkingRoom;

  let canStartConversation =
    !isMyUser && !isMyGroup && !participantInConversation && !participantInConferenceRoom && participantSession;
  let canJoinConversation =
    !isMyUser &&
    !isMyGroup &&
    !participantInConferenceRoom &&
    liveGroup &&
    _.size(liveGroup.participants) < MAX_PARTICIPANTS_GROUP;

  let userInConversation = userSession && !!userSession.groupId;

  // console.log({
  //   participantSession,
  //   participantInConversation,
  //   userInConferenceRoom,
  //   participantInConferenceRoom,
  //   canStartConversation,
  //   canJoinConversation,
  // });

  const handleClose = () => {
    dispatch(closeJoinParticipant());
  };

  if (!participant) {
    return (
      <div>
        <Dialog open={open} onClose={handleClose} maxWidth={"sm"}>
          <div className={classes.content}>
            <Alert severity="info">
              Sorry, no one is available at the moment. <br />
              Check out the ‘Conversations’ tab and join an existing conversation.
            </Alert>
          </div>
        </Dialog>
      </div>
    );
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
    handleClose();
  };

  const handleJoinConversation = (e) => {
    e.preventDefault();
    if (liveGroup) {
      if (userInConferenceRoom) {
        setIsInConferenceRoom(false);
      }
      joinConversation(sessionId, participantsJoined, liveGroups, userId, liveGroup.id, snackbar);
      handleClose();
    }
  };
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
                    {!userInConferenceRoom && !userInConversation && (
                      <Alert severity="info" className={classes.alert}>
                        You will join this conversation video conferencing call
                      </Alert>
                    )}

                    {!userInConferenceRoom && userInConversation && (
                      <Alert severity="warning" className={classes.alert}>
                        You will leave your current conversation and join this one
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
              {!userInConferenceRoom && !userInConversation && (
                <Alert severity="info" className={classes.alert}>
                  Start a video-call with {participant.firstName} now{/* </Typography> */}
                </Alert>
              )}

              {!userInConferenceRoom && userInConversation && (
                <Alert severity="warning" className={classes.alert}>
                  You will leave your current conversation and start a new one with {participant.firstName}
                </Alert>
              )}
            </React.Fragment>
          )}
          {participantInConferenceRoom /* && (canJoinConversation || canStartConversation) */ && (
            <div className={classes.buttonContainer}>
              <Alert severity="info" className={classes.alert}>
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
              <Alert severity="info" className={classes.alert}>
                When starting this conversation, you will leave the "Main Stage and enter the 'Networking Area', but you
                can come back at any time. Happy networking!
              </Alert>
            </div>
          )}

          {!participantSession && (
            <div className={classes.buttonContainer}>
              {/* <div style={{ textAlign: "center", width: "100%" }}>
                <SuccessIcon style={{ fontSize: 64, color: "#53a653" }} />
              </div> */}
              <Alert severity="info" className={classes.alert}>
                {participant.firstName} is currently offline
              </Alert>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
