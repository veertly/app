import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Checkbox,
  FormControlLabel,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import useDeviceDetect from "../../Hooks/useDeviceDetect";
import MarginProvider from "./MarginProvider";

const useStyles = makeStyles(() => ({
  dialogRoot: {
    borderRadius: 8,
  }
}));

const CompatibilityDialog = () => {
  const classes = useStyles();
  const { message, showDialog, hideDialog } = useDeviceDetect();
  const [checked, setChecked] = useState(false);


  const handleChecked = () => {
    setChecked(!checked)
  }

  const handleButtonClick = () => {
    hideDialog(checked);
  }

  return (
    <Dialog
      className={classes.dialogRoot}
      disableBackdropClick
      disableEscapeKeyDown
      open={showDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="simple-dialog-title">Change your browser</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>

        <MarginProvider
          top={8}
        >
          <FormControlLabel
            control={
              <Checkbox
              checked={checked}
              onChange={handleChecked}
              color="default"
              inputProps={{ "aria-label": "checkbox with default color" }}
              />
            }
            label="Never show again"
          >
          </FormControlLabel>
        </MarginProvider>
      

      </DialogContent>
      <DialogActions>
        <Button onClick={handleButtonClick} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompatibilityDialog;
