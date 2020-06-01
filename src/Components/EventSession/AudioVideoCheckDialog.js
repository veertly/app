import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
// import { createNewRoom } from "../../Modules/eventSessionOperations";
// import { useSnackbar } from "material-ui-snackbar-provider";
import Webcam from "react-webcam";
// import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: theme.spacing(0),
    // margin: 0,
  },
  dialogTitle: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    textAlign: "center",
  },
  dialogContent: {
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between"
  },
  button: ({ loading }) => ({
    opacity: loading ? 0.5 : 1,
    width: "90%",
    alignSelf: "center",
    marginTop: theme.spacing(4)
  }),
  cameraContainer: {
    height: "100%",
    width: "100%",
  }
}));

const AudioVideoCheckDialog = ({ handleSubmit, sessionId }) => {
  const styles = useStyles();

  return (
    // <Paper>
      <Dialog open className={styles.dialog} fullWidth maxWidth="xs">
        <DialogTitle className={styles.dialogTitle} id="form-dialog-title">

          You are about to join {sessionId}
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          
          <div className={styles.cameraContainer}>
            <Webcam 
              height="100%"
              width="100%"
            />
          </div>
          
          <Button
            className={styles.button}
            onClick={handleSubmit}
            // type="submit"
            variant="contained"
            color="primary"
          >
            Join Event
          </Button>

        </DialogContent>
      </Dialog>
    // </Paper>
  )
}

export default AudioVideoCheckDialog;
