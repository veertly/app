import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ParticipantCard from "./ParticipantCard";
import { createNewConversation } from "../../Modules/eventSessionOperations";
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
}));

export default function (props) {
  const classes = useStyles();
  const snackbar = useSnackbar();

  const { open, setOpen, participant, eventSession, user, showJoinButton } = props;

  const handleClose = () => {
    setOpen(false);
  };
  if (!participant) {
    return null;
  }

  const startConversation = (e) => {
    e.preventDefault();
    try {
      createNewConversation(eventSession, user.uid, participant.id, snackbar);
    } catch (error) {
      console.error(error);
    }
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        // PaperComponent={PaperComponent}
        // aria-labelledby="draggable-dialog-title"
        maxWidth={"sm"}
      >
        <div className={classes.content}>
          <ParticipantCard participant={participant} />
          {showJoinButton && (
            <React.Fragment>
              <div className={classes.buttonContainer}>
                <Button variant="contained" color="primary" className={classes.button} onClick={startConversation}>
                  Start Conversation
                </Button>
              </div>
              <Typography className={classes.hintText} variant="caption">
                You will join new a video conferencing call with the selected participant.
              </Typography>
            </React.Fragment>
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
