import React, { useState } from "react";
import { makeStyles, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@material-ui/core";
import DialogClose from "../../Misc/DialogClose";
import { createBroadcastMessage, updateBroadcastMessage, BROADCAST_MESSAGE_STATES, launchBroadcastMessage } from "../../../Modules/broadcastOperations";
import { useSelector } from "react-redux";
import { getSessionId, getUserId } from "../../../Redux/eventSession";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative"
    // width: theme.breakpoints.values.sm
    // padding: theme.spacing(6),
    // textAlign: "center"
  },
  dialog: {
    width: theme.breakpoints.width.sm
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
  },
  avatarsContainer: {
    padding: theme.spacing(3)
  },
  avatar: {
    margin: theme.spacing(0.5)
  },
  dialogTitle: {
    color: theme.palette.primary.main
  },
  button: {
    margin: theme.spacing(2)
  },
  infoIcon: {
    marginTop: theme.spacing(1.25)
  }
}));


const CreateBroadcastDialog = ({ open, closeDialog, broadcastMessage = null }) => {
  const [message, setMessage] = useState(broadcastMessage ? broadcastMessage.message : "");
  const [executingAction, setExecutingAction] = useState(false);
  const classes = useStyles();
  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);

  const handleClose = () => {
    closeDialog();
    setExecutingAction(false);
  }

  const handleCreateBroadcast = async (event) => {
    event.preventDefault()
    console.log("create broadcast");
    setExecutingAction(true);
    // await createBroadcastMessage({
    //   sessionId,
    //   userId,
    //   message,
    // });
    await launchBroadcastMessage({
      sessionId,
      userId,
      message
    })
    handleClose();
  };

  const handleDraftBroadcast = async () => {
    console.log("create draft broadcast");

    if (broadcastMessage) {
      await updateBroadcastMessage({
        sessionId,
        userId,
        originalBroadcast: broadcastMessage,
        newMessage: message,
        newState: BROADCAST_MESSAGE_STATES.DRAFT,
      });
    } else {
      await createBroadcastMessage({
        sessionId,
        userId,
        message,
        state: BROADCAST_MESSAGE_STATES.DRAFT,
      });
    }
    handleClose();
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  }

  return (
    <DialogClose
      open={open}
      onClose={handleClose}
      aria-labelledby="draggable-dialog-title"
      fullWidth
      maxWidth="xs"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <form onSubmit={handleCreateBroadcast}>
        <DialogTitle className={classes.dialogTitle}>
          {broadcastMessage ? "Edit broadcast message" : "New broadcast message"}
        </DialogTitle>
        
        <DialogContent>
          <TextField
            id="broadcast-message" 
            label="Enter your message"
            variant="outlined"
            value={message}
            onChange={handleChange}
          >

          </TextField>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            className={classes.button}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDraftBroadcast}
            className={classes.button}
            color="primary"
            variant="outlined"
            disabled={executingAction}
            // disabled={poll && poll.state !== POLLS_STATES.DRAFT}
          >
            Save draft
          </Button>

          <Button
            onClick={handleCreateBroadcast}
            className={classes.button}
            color="primary"
            variant="contained"
            type="submit"
            disabled={executingAction}
          >
            Launch
          </Button>
        </DialogActions>
      </form>
    </DialogClose>
  )
}

export default CreateBroadcastDialog;
