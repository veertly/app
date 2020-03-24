import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default props => {
  const { open, setOpen, handleLeaveCall } = props;

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Leave current call"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to leave the current call?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLeaveCall} color="primary" autoFocus>
            Leave Call
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
