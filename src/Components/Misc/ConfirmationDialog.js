import React, { useState } from "react";
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

const ConfirmationDialog = ({
  open,
  closeDialog,
  title,
  alertMessage,
  severity = "info",
  onConfirm,
  confirmationButtonLabel = "Confirm"
}) => {
  const classes = useStyles();

  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleOnConfirm = async () => {
    try {
      setConfirming(true);
      await onConfirm();
      setConfirming(false);
      closeDialog();
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>

      <DialogContent>
        <Alert severity={severity}>{alertMessage}</Alert>
        {error && <Alert severity="error">{error}</Alert>}
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
          onClick={handleOnConfirm}
          className={classes.button}
          color="primary"
          variant="contained"
          disabled={confirming}
        >
          {confirmationButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
