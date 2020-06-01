import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import ParticipantCard from "./ParticipantCard";
import { joinConversation } from "../../Modules/eventSessionOperations";
import { useSnackbar } from "material-ui-snackbar-provider";
import _ from "lodash";
import { useSelector, shallowEqual } from "react-redux";
import {
  getParticipantsJoined,
  getSessionId,
  getUserId,
  getLiveGroupsOriginal
} from "../../Redux/eventSession";
import Alert from "@material-ui/lab/Alert";
import { MAX_PARTICIPANTS_GROUP } from "../../Config/constants";
const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    width: theme.breakpoints.values.sm,
    padding: theme.spacing(6)
  },
  closeContainer: {
    position: "absolute"
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    paddingTop: theme.spacing(2)
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
  participantContainer: {
    marginBottom: theme.spacing(3)
  },
  alert: {
    marginTop: theme.spacing(2)
  }
}));

export default function (props) {
  const classes = useStyles();
  const snackbar = useSnackbar();

  const { open, setOpen, group, groupId } = props;

  const participantsJoined = useSelector(getParticipantsJoined, shallowEqual);
  const liveGroups = useSelector(getLiveGroupsOriginal, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);

  const handleClose = () => {
    setOpen(false);
  };

  const liveGroup = React.useMemo(
    () => (liveGroups && groupId ? liveGroups[groupId] : null),
    [groupId, liveGroups]
  );
  if (!group || group.length === 0) {
    return null;
  }

  const handleJoinConversation = (e) => {
    e.preventDefault();
    joinConversation(
      sessionId,
      participantsJoined,
      liveGroups,
      userId,
      groupId,
      snackbar
    );
    setOpen(false);
  };

  let isMyGroup =
    group.find((participant) => participant.id === userId) !== undefined;

  const canJoinConversation =
    !isMyGroup &&
    (liveGroup.isRoom ||
      (!liveGroup.isRoom &&
        _.size(liveGroup.participants) < MAX_PARTICIPANTS_GROUP));

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <div className={classes.content}>
          <div style={{ marginBottom: isMyGroup ? -16 : 8 }}>
            {group.map((participant) => {
              return (
                <div
                  className={classes.participantContainer}
                  key={participant.id}
                >
                  <ParticipantCard participant={participant} />
                </div>
              );
            })}
          </div>
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
              <Alert severity="info" className={classes.alert}>
                You will join this conversation video conferencing call
              </Alert>
            </div>
          )}
          {/* {isMyGroup && <div className={classes.emptySpaceBottom}></div>} */}
        </div>
      </Dialog>
    </div>
  );
}
