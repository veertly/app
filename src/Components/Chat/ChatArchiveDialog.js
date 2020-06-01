import React from "react";
import {
  makeStyles,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import ChatMessage from "./ChatMessage";
import { getUsers, getSessionId, getUserId } from "../../Redux/eventSession";
import { useSelector, shallowEqual } from "react-redux";
import { archiveChatMessage } from "../../Modules/chatMessagesOperations";
import { CHAT_GLOBAL_NS } from "../../Contexts/ChatMessagesContext";

const useStyles = makeStyles((theme) => ({
  button: { margin: theme.spacing(2) },
  dialogTitle: { color: theme.palette.primary.main }
}));

const ChatArchiveDialog = ({ open, closeDialog, message }) => {
  const classes = useStyles();
  const users = useSelector(getUsers, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);

  const handleArchiveMessage = () => {
    archiveChatMessage(sessionId, CHAT_GLOBAL_NS, message.messageId, userId);
    closeDialog();
  };
  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle className={classes.dialogTitle}>
        Archiving message
      </DialogTitle>

      <DialogContent>
        {message && <ChatMessage message={message} users={users} previewOnly />}
        <Alert severity="error">
          This message will be removed for all attendees
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color="primary"
          className={classes.button}
        >
          Cancel
        </Button>
        <Button
          onClick={handleArchiveMessage}
          className={classes.button}
          color="primary"
          variant="contained"
        >
          Archive
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatArchiveDialog;
