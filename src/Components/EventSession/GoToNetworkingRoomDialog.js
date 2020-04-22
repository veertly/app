import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default (props) => {
  const { open, setOpen, handleLeaveCall } = props;

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Ready to network with other participants?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will leave the 'Main Stage' when joining the 'Networking Area'. <br />
            But no worries you can come back at any time. Happy networking!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLeaveCall} color="primary" autoFocus>
            Go to networking area
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
