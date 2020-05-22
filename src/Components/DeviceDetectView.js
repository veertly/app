import React, { useState, useEffect } from "react";
import {
  Snackbar,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  Button,
} from "@material-ui/core";
// import { Alert } from "@material-ui/lab";
import { isMobileFromRdd, isChromeFromRRd } from "../Utils/device";

const MOBILE_MSG = "Veertly is best experienced on desktop or laptop. Some features may not be available on mobile";
const CHROME_APP = "Veertly is best experienced on Google Chrome";

const DeviceDetectView = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage]= useState("");

  useEffect(() => {
    if (isMobileFromRdd()) {
      setOpen(true);
      setMessage(MOBILE_MSG);
    } else if (!isChromeFromRRd()) {
      setOpen(true);
      setMessage(CHROME_APP);
    }
  }, []);


  // const handleClose = (eventToast, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //   setOpen(false);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  return (
  <>
    {children}
  
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      // autoHideDuration={2000}
      message={message}
      // onClose={handleClose}
      action={
        <Button onClick={handleClose} color="secondary" >
          OK
        </Button>
      }
      />

      {/* <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog> */}

  </>
)}

export default DeviceDetectView;
