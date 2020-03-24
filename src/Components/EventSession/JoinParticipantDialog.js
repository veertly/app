import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ParticipantCard from "./ParticipantCard";
import { createNewConversation } from "../../Modules/eventSessionOperations";
import { useSnackbar } from "material-ui-snackbar-provider";

const useStyles = makeStyles(theme => ({
  content: {
    position: "relative"
  },
  closeContainer: {
    position: "absolute"
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    marginTop: theme.spacing(2)
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
  }
}));

function PaperComponent(props) {
  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function(props) {
  const classes = useStyles();
  const snackbar = useSnackbar();

  const { open, setOpen, participant, eventSession, user, onConferenceRoom } = props;

  const handleClose = () => {
    setOpen(false);
  };
  if (!participant) {
    return null;
  }

  const startConversation = e => {
    e.preventDefault();
    try {
      createNewConversation(eventSession, user.uid, participant.id, snackbar);
    } catch (error) {
      debugger;
    }
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <div className={classes.content}>
          <ParticipantCard participant={participant} />
          {!onConferenceRoom && participant.id !== user.uid && (
            <React.Fragment>
              <div className={classes.buttonContainer}>
                <Button variant="contained" color="secondary" className={classes.button} onClick={startConversation}>
                  Start Conversation
                </Button>
              </div>
              <Typography className={classes.hintText} variant="caption">
                You will join new a video conferencing call with the selected participant.
              </Typography>
            </React.Fragment>
          )}
          {(onConferenceRoom || participant.id === user.uid) && <div className={classes.emptySpaceBottom}></div>}
        </div>
      </Dialog>
    </div>
  );
}
