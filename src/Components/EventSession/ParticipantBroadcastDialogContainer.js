import React, { useContext, useState, useEffect } from "react";
import BroadcastMessagesContext from "../../Contexts/BroadcastMessagesContext";
import { useSelector } from "react-redux";
import { isEventOwner } from "../../Redux/eventSession";
import { Dialog, DialogContent, DialogActions, DialogTitle, Button, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: { margin: theme.spacing(2) },
  dialogTitle: { color: theme.palette.primary.main }
}));


const ParticipantBroadcastDialogContainer = () => {
  const classes = useStyles();
  const {
    activeBroadcastMessage
  } = useContext(BroadcastMessagesContext);
  
  const isOwner = useSelector(isEventOwner);

  const [showDialog, setShowDialog] = useState(false);

  const handleClose = () => {
    setShowDialog(false);
  }

  useEffect(() => {
    setShowDialog(!!activeBroadcastMessage);
  }, [activeBroadcastMessage, setShowDialog])

  if (activeBroadcastMessage && !isOwner) {
    console.log("show Dialog");
    return (
      <Dialog open={showDialog} onClose={handleClose}>
        <DialogTitle className={classes.dialogTitle}>Announcement</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {activeBroadcastMessage.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            className={classes.button}
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    )
  };
  console.log("no active dialog")
  return null;
};

export default ParticipantBroadcastDialogContainer;
