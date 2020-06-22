import React, { useState } from "react";
import { makeStyles, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@material-ui/core";
import DialogClose from "../../Misc/DialogClose";
import { createBroadcastMessageDrafted, setBroadcastMessageToDrafted, launchBroadcastMessage } from "../../../Modules/broadcastOperations";
import { useSelector } from "react-redux";
import { getSessionId, getUserId } from "../../../Redux/eventSession";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.primary.main
  },
  button: {
    margin: theme.spacing(2)
  },
  textField: {
    width: "100%",
  },
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

    if (broadcastMessage) {
      await setBroadcastMessageToDrafted({
        sessionId,
        userId,
        originalBroadcast: broadcastMessage,
        newMessage: message,
      });
    } else {
      await createBroadcastMessageDrafted({
        sessionId,
        userId,
        message,
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
            fullWidth
            multiline
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
            Publish
          </Button>
        </DialogActions>
      </form>
    </DialogClose>
  )
}

export default CreateBroadcastDialog;
