import React, { useState, useContext } from "react";

import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
// import { createNewRoom } from "../../Modules/eventSessionOperations";
// import { useSnackbar } from "material-ui-snackbar-provider";
import Webcam from "react-webcam";
// import { Paper } from "@material-ui/core";
import { Switch, Paper, Box, Typography } from "@material-ui/core";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
// import { setVideoMuteStatusDB, setAudioMuteStatusDB } from "../../Modules/eventSessionOperations";
// import { useDocumentData } from "react-firebase-hooks/firestore";
// import firebase from "../../Modules/firebaseApp";
// import { getButtonText } from "../../Utils";
import TechnicalCheckContext from "../../Containers/EventSession/TechnicalCheckContext";
// import { useMediaDevices } from "react-use";

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
  tryAgainButton: {
    opacity: 1,
    width: "90%",
    alignSelf: "center",
    marginTop: theme.spacing(4)
  },
  enterWithoutButton : {
    width: "90%",
    alignSelf: "center",
    marginTop: theme.spacing(2)
  },
  cameraContainer: {
    height: "100%",
    width: "100%",
    maxHeight: 270,
    // backgroundColor: "gray",
    padding: 0,
    position: "relative"
  },
  switchesContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginTop: theme.spacing(4),
    justifyContent: "space-around",
  },
  switchWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  alert: {
    marginTop: theme.spacing(2),
    textAlign: "center",
  }
}));

const PERMISSION_ERROR_STATUS = {
  BLOCKED: "BLOCKED",
  DISMISSED: "DISMISSED",
  UNKNOWN: "UNKNOWN"
};

const getPermissionStatusForError = (error="") => {
  if (error.toLowerCase().indexOf("denied")) {
    return PERMISSION_ERROR_STATUS.BLOCKED;
  } else if (error.toLowerCase().indexOf("dismissed")) {
    return PERMISSION_ERROR_STATUS.DISMISSED;
  } else {
    return PERMISSION_ERROR_STATUS.UNKNOWN;
  }
};

const AudioVideoCheckDialog = ({ sessionId }) => {
  const styles = useStyles();
  // const mediaDevices = useMediaDevices();
  // const [eventSessionData] = useDocumentData(
  //   firebase
  //   .firestore()
  //   .collection("eventSessions")
  //   .doc(sessionId)
  // )
  const { showAudioVideoCheck, setShowAudioVideoCheck, devicesPermissionGiven, enterWithoutPermissions,setAudioVideoPermissionFromOutside, muteVideo, muteAudio, setMuteAudio, setMuteVideo } = useContext(TechnicalCheckContext);

  const [showAlert, setShowAlert] = useState(false);
  const [errorState, setErrorState] = useState(PERMISSION_ERROR_STATUS.UNKNOWN);

  // const muteVideo = useSelector(getMuteVideoOnEnter)
  // const muteAudio = useSelector(getMuteAudioOnEnter);

  const handleVideoToggle = () => {
    // setMuteVideo(!muteVideo)
    // dispatch(setMuteVideo(sessionId))
    // setVideoMuteStatusDB(!muteVideo, sessionId);
    setMuteVideo(!muteVideo);
  };

  const handleAudioToggle = () => {
    // setMuteAudio(!muteAudio)
    // dispatch(setMuteAudio(sessionId))
    // setAudioMuteStatusDB(!muteAudio, sessionId);
    setMuteAudio(!muteAudio)
  };

  const handleClickPreview = () => {
    setShowAudioVideoCheck(false);
  };


  const handleTryAgain = () => {
    window.location.reload();
  }

  const VideoSwitch = () => {
    return (
      <div className={styles.switchWrapper}>
        {!muteVideo && <VideocamIcon />}
        {muteVideo && <VideocamOffIcon />}
        <Switch
          checked={!muteVideo}
          onChange={handleVideoToggle}
          name="mute video"
          color="primary"
        >
        </Switch>
      </div>
    )
  };

  const AudioSwitch = () => {
    return (
      <div className={styles.switchWrapper}>
        {muteAudio && <MicOffIcon />}
        {!muteAudio && <MicIcon />}
        <Switch
          checked={!muteAudio}
          onChange={handleAudioToggle}
          name="mute audio"
          color="primary"
        >
        </Switch>
      </div>
    )
  };

  if (!showAudioVideoCheck) {
    return null;
  }

  return (
    // <Paper>
      <Dialog open className={styles.dialog} fullWidth maxWidth="xs">
        <DialogTitle className={styles.dialogTitle} id="dialog-title">
          Audio/Video Settings
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
            <Paper className={styles.cameraContainer}>
              <Webcam
                onUserMedia={() => {
                  setAudioVideoPermissionFromOutside(true);
                }}
                onUserMediaError={(e) => {
                  console.log("error", e.message, typeof e);
                  setAudioVideoPermissionFromOutside(false);
                  setShowAlert(true);
                  setErrorState(getPermissionStatusForError(e.message));
                }}
                height="100%"
                width="100%"
              />

              { showAlert &&
                <Box top="0" left="0" position="absolute" bgcolor="#EEEEEE" height="100%" width="100%" display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                  <VideocamOffIcon style={{fontSize: 32}} color="error" />
                </Box>
              }

            </Paper>

          {
            showAlert && 
            <>
              <Box marginTop={2}>
                <Alert severity="error">Woops! Access denied</Alert>
              </Box>
              
              <Box marginTop={1} padding={1} display="flex" flexDirection="column" alignItems="center">
                {
                 errorState === PERMISSION_ERROR_STATUS.BLOCKED && 
                 (
                   <>
                    <Typography variant="subtitle1">
                      Allow access to your camera by adjusting your settings on clicking the video icon in the URL bar.
                      Then refresh the page.
                    </Typography>
                   </>
                 )
                }
                {
                 errorState === PERMISSION_ERROR_STATUS.DISMISSED && 
                 (
                   <>
                    <Typography variant="subtitle1">
                      Please refresh the page and select "Allow" when prompted
                    </Typography>
                   </>
                 )
                }
                {
                 errorState === PERMISSION_ERROR_STATUS.DISMISSED && 
                 (
                   <>
                    <Typography variant="subtitle1">
                      Unable to get camera/mic access. Please check you settings
                    </Typography>
                   </>
                 )
                }
              </Box>
              
              {/* <Alert severity="info" className={styles.alert}>
                
                Veertly require audio and video permissions. Please refresh, and select "Allow" when prompted
              </Alert> */}
            </>

          }

          <div className={styles.switchesContainer}>
            <VideoSwitch />
            <AudioSwitch />
          </div>
          
          {
            devicesPermissionGiven && 
            <Button
            className={styles.button}
            onClick={handleClickPreview}
            // type="submit"
            variant="contained"
            color="primary"
            >
              Join Event
            </Button>
          }

          { !devicesPermissionGiven &&

            <>
              <Button
              className={styles.tryAgainButton}
              onClick={handleTryAgain}
              // type="submit"
              variant="contained"
              color="primary"
              >
                Try Again
              </Button>

              <Button
                className={styles.enterWithoutButton}
                onClick={enterWithoutPermissions}
                // type="submit"
                variant="outlined"
                color="primary"
              >
                Enter without devices 
              </Button>
            </>
            
          }

        </DialogContent>
      </Dialog>
    // </Paper>
  )
};

export default AudioVideoCheckDialog;
