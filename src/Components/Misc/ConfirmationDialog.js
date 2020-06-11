import React, { useState } from "react";
import {
  makeStyles,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box
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

  const handleOnConfirm = () => {
    const execute = async () => {
      try {
        setConfirming(true);
        setError(null);
        await onConfirm();
        closeDialog();
      } catch (error) {
        setError(error);
        console.error(error);
      }
      setConfirming(false);
    };
    execute();
  };
  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>

      <DialogContent>
        <Alert severity={severity}>{alertMessage}</Alert>
        {error && (
          <Box mt={2}>
            <Alert severity="error">{error.message}</Alert>
          </Box>
        )}
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
