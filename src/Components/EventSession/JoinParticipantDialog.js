import React, { useMemo } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ParticipantCard from "./ParticipantCard";
import {
  createNewConversation,
  joinConversation
} from "../../Modules/eventSessionOperations";
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
  getLiveGroupsOriginal,
  getFeatureDetails,
  isEventOwner as isEventOwnerSelector
} from "../../Redux/eventSession";
import {
  isJoinParticipantOpen,
  closeJoinParticipant,
  getJoinParticipantEntity
} from "../../Redux/dialogs";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import _ from "lodash";
import Alert from "@material-ui/lab/Alert";
import { MAX_PARTICIPANTS_GROUP } from "../../Config/constants";
import ParticipantAvatar from "../Misc/ParticipantAvatar";
import {
  isParticipantOnNetworkingCall,
  isParticipantMainStage,
  isParticipantOnCall,
  isParticipantAvailableForCall
} from "../../Helpers/participantsHelper";
import DialogClose from "../Misc/DialogClose";
import { FEATURES } from "../../Modules/features";
import { VERTICAL_NAV_OPTIONS } from "../../Contexts/VerticalNavBarContext";
import { Box } from "@material-ui/core";
import ParticipantSettingsMenu from "./ParticipantSettingsMenu";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    width: theme.breakpoints.values.sm,
    padding: theme.spacing(6)
  },
  settingsContainer: {
    position: "absolute",
    right: 48,
    top: 8
  },
  closeContainer: {
    position: "absolute"
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    marginTop: theme.spacing(4)
  },
  hintText: {
    marginBottom: theme.spacing(4),
    display: "block",
    width: 400,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2)
  },
  emptySpaceBottom: {
    marginBottom: theme.spacing(4)
  },
  conversationWith: {
    margin: theme.spacing(3, 0)
  },
  participantContainer: {
    margin: theme.spacing(2, 0)
  },
  alert: {
    marginTop: theme.spacing(2),
    textAlign: "left"
  },
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

export default function (props) {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();

  const open = useSelector(isJoinParticipantOpen);
  const participantEntity = useSelector(getJoinParticipantEntity, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);
  const userGroup = useSelector(getUserLiveGroup, shallowEqual);
  const users = useSelector(getUsers, shallowEqual);
  const userSession = useSelector(getUserSession, shallowEqual);
  const availableParticipantsList = useSelector(
    getAvailableParticipantsList,
    shallowEqual
  );
  const liveGroups = useSelector(getLiveGroups, shallowEqual);
  const liveGroupsOriginal = useSelector(getLiveGroupsOriginal, shallowEqual);
  const participantsJoined = useSelector(getParticipantsJoined, shallowEqual);
  const isEventOwner = useSelector(isEventOwnerSelector);

  const participant = React.useMemo(
    () => (participantEntity ? users[participantEntity.id] : null),
    [participantEntity, users]
  );

  const participantSession = React.useMemo(
    () =>
      _.find(
        availableParticipantsList,
        (p) => participant && p.id === participant.id
      ),
    [availableParticipantsList, participant]
  );

  const liveGroup = React.useMemo(
    () =>
      liveGroups && participantSession && participantSession.groupId
        ? liveGroups[participantSession.groupId]
        : null,
    [liveGroups, participantSession]
  );

  const isMyGroup = React.useMemo(
    () => liveGroup && _.find(liveGroup.participants, (p) => p.id === userId),
    [liveGroup, userId]
  );
  const isMyUser = userId && participant && userId === participant.id;

  const participantInConversation = useMemo(
    () => isParticipantOnNetworkingCall(participantSession),
    [participantSession]
  );

  const participantAvailableForCall = useMemo(
    () => isParticipantAvailableForCall(participantSession),
    [participantSession]
  );

  const userInConferenceRoom = useMemo(
    () => isParticipantMainStage(userSession),
    [userSession]
  );

  const participantInConferenceRoom = useMemo(
    () => !isMyUser && isParticipantMainStage(participantSession),
    [isMyUser, participantSession]
  );

  const canStartConversation = useMemo(
    () =>
      !isMyUser &&
      !isMyGroup &&
      !participantInConversation &&
      !participantInConferenceRoom &&
      participantSession &&
      participantAvailableForCall,
    [
      isMyUser,
      isMyGroup,
      participantInConversation,
      participantInConferenceRoom,
      participantSession,
      participantAvailableForCall
    ]
  );

  const canJoinConversation = useMemo(
    () =>
      !isMyUser &&
      !isMyGroup &&
      !participantInConferenceRoom &&
      liveGroup &&
      (liveGroup.isRoom ||
        (!liveGroup.isRoom &&
          _.size(liveGroup.participants) < MAX_PARTICIPANTS_GROUP)),
    [isMyUser, isMyGroup, participantInConferenceRoom, liveGroup]
  );
  let userInConversation = useMemo(() => isParticipantOnCall(userSession), [
    userSession
  ]);

  const customNavBarFeature = useSelector(
    getFeatureDetails(FEATURES.CUSTOM_NAV_BAR),
    shallowEqual
  );

  const mainStageTitle = useMemo(() => {
    if (
      customNavBarFeature &&
      customNavBarFeature[VERTICAL_NAV_OPTIONS.mainStage]
    ) {
      return customNavBarFeature[VERTICAL_NAV_OPTIONS.mainStage].label;
    }
    return "Main Stage";
  }, [customNavBarFeature]);

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
              Sorry no attendee is available for a conversation at the moment.
              {/* Either they are on the ‘Main Stage’ or busy talking to others
              already on the ‘Networking Area’. <br />
              Check out the ‘Conversations’ tab to join an existing
              conversation. */}
            </Alert>
          </div>
        </Dialog>
      </div>
    );
  }

  const startConversation = (e) => {
    e.preventDefault();
    try {
      createNewConversation(
        sessionId,
        userId,
        participant.id,
        userGroup,
        snackbar
      );
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  const handleJoinConversation = (e) => {
    e.preventDefault();
    if (liveGroup) {
      joinConversation(
        sessionId,
        participantsJoined,
        liveGroupsOriginal,
        userId,
        liveGroup.id,
        snackbar
      );
      handleClose();
    }
  };
  return (
    <div>
      <DialogClose open={open} onClose={handleClose} maxWidth={"sm"}>
        <div className={classes.content}>
          <ParticipantCard participant={participant} />
          {isEventOwner && (
            <Box className={classes.settingsContainer}>
              <ParticipantSettingsMenu participant={participant} />
            </Box>
          )}
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
                {liveGroup && !liveGroup.isRoom && (
                  <Typography variant="button" color="primary">
                    In a conversation with:
                  </Typography>
                )}

                {liveGroup && liveGroup.isRoom && (
                  <Typography variant="button" color="primary">
                    In the room: {liveGroup.roomName}
                  </Typography>
                )}

                {liveGroup &&
                  !liveGroup.isRoom &&
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

                {liveGroup && liveGroup.isRoom && liveGroup.participants && (
                  <>
                    <div style={{ display: "flex", marginTop: 16 }}>
                      {Object.values(liveGroup.participants).map((p) => {
                        if (p.id === participant.id) {
                          return null;
                        }
                        let pDetails = users[p.id];
                        if (!pDetails) {
                          return null;
                        }
                        return (
                          <div key={p.id} className={classes.avatar}>
                            <ParticipantAvatar participant={pDetails} />
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {canJoinConversation && (
                  <div>
                    <div className={classes.buttonContainer}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={handleJoinConversation}
                      >
                        Join{" "}
                        {liveGroup && liveGroup.isRoom
                          ? "Room"
                          : "Conversation"}
                      </Button>
                    </div>
                    {/* <Typography className={classes.hintText} variant="caption"> */}
                    {!userInConferenceRoom && !userInConversation && (
                      <Alert severity="info" className={classes.alert}>
                        You will join this{" "}
                        {liveGroup && liveGroup.isRoom
                          ? "room's"
                          : "conversation's"}{" "}
                        video conferencing call
                      </Alert>
                    )}

                    {!userInConferenceRoom && userInConversation && (
                      <Alert severity="warning" className={classes.alert}>
                        You will leave your current conversation and join this
                        one
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
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={startConversation}
                >
                  Start Conversation
                </Button>
              </div>
              {/* <Typography className={classes.hintText} variant="caption"> */}
              {!userInConferenceRoom && !userInConversation && (
                <Alert severity="info" className={classes.alert}>
                  Start a video-call with {participant.firstName} now
                  {/* </Typography> */}
                </Alert>
              )}

              {!userInConferenceRoom && userInConversation && (
                <Alert severity="warning" className={classes.alert}>
                  You will leave your current conversation and start a new one
                  with {participant.firstName}
                </Alert>
              )}
            </React.Fragment>
          )}

          {participantInConferenceRoom && (
            <div className={classes.buttonContainer}>
              <Alert severity="info" className={classes.alert}>
                {participant.firstName} is currently watching the presentation
                on the {mainStageTitle} and is not available to talk
              </Alert>
            </div>
          )}

          {/* {userInConferenceRoom &&
            (canJoinConversation || canStartConversation) && (
              <div className={classes.buttonContainer}>
                <Alert severity="info" className={classes.alert}>
                  When starting this conversation, you will leave the 'Main
                  Stage' and enter the 'Networking Area', but you can come back
                  at any time. Happy networking!
                </Alert>
              </div>
            )} */}
          {participantSession &&
            !isMyUser &&
            !participantAvailableForCall &&
            !participantInConversation &&
            !participantInConferenceRoom && (
              <div className={classes.buttonContainer}>
                <Alert severity="info" className={classes.alert}>
                  {participant.firstName} is not available to talk
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
      </DialogClose>
    </div>
  );
}
