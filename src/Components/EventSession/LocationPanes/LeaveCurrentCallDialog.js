import React from "react";
import {
  makeStyles,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  button: { margin: theme.spacing(2) }
}));

const LeaveCurrentCallDialog = ({ open, setOpen, onConfirmation }) => {
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Leaving conversation</DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Alert severity="warning">
            You are about to leave your current conversation.
          </Alert>
        </DialogContentText>
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
          onClick={onConfirmation}
          className={classes.button}
          color="primary"
          variant="contained"
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveCurrentCallDialog;
