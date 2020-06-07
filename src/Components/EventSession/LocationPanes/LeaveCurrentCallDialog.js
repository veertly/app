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

const useStyles = makeStyles((theme) => ({
  button: { margin: theme.spacing(2) },
  dialogTitle: { color: theme.palette.primary.main }
}));

const LeaveCurrentCallDialog = ({ open, setOpen, onConfirmation }) => {
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className={classes.dialogTitle}>
        Leaving conversation
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning">
          You are about to leave your current conversation.
        </Alert>
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
