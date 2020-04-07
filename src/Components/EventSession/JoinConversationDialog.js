import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ParticipantCard from "./ParticipantCard";
import { joinConversation } from "../../Modules/eventSessionOperations";
import { useSnackbar } from "material-ui-snackbar-provider";

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
    paddingTop: theme.spacing(2),
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
  participantContainer: {
    marginBottom: theme.spacing(3),
  },
}));

export default function (props) {
  const classes = useStyles();
  const snackbar = useSnackbar();

  const { open, setOpen, group, eventSession, groupId, user } = props;

  const handleClose = () => {
    setOpen(false);
  };
  if (!group || group.length === 0) {
    return null;
  }

  const handleJoinConversation = (e) => {
    e.preventDefault();
    joinConversation(eventSession, user.uid, groupId, snackbar);
    setOpen(false);
  };
  let myUser = group.find((participant) => participant.id === user.uid);
  let isMyGroup = group.find((participant) => participant.id === user.uid) !== undefined;
  console.log({ group, isMyGroup, myId: user.uid, myUser });
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
        <div className={classes.content}>
          <div style={{ marginBottom: isMyGroup ? -16 : 8 }}>
            {group.map((participant) => {
              return (
                <div className={classes.participantContainer} key={participant.id}>
                  <ParticipantCard participant={participant} />
                </div>
              );
            })}
          </div>
          {!isMyGroup && (
            <div>
              <div className={classes.buttonContainer}>
                <Button variant="contained" color="primary" className={classes.button} onClick={handleJoinConversation}>
                  Join Conversation
                </Button>
              </div>
              <Typography className={classes.hintText} variant="caption">
                You will join the video conferencing call of the selected group.
              </Typography>
            </div>
          )}
          {/* {isMyGroup && <div className={classes.emptySpaceBottom}></div>} */}
        </div>
      </Dialog>
    </div>
  );
}
