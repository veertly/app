import React, { useState, useContext } from "react";

import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
// import { createNewRoom } from "../../Modules/eventSessionOperations";
// import { useSnackbar } from "material-ui-snackbar-provider";
import Webcam from "react-webcam";
// import { Paper } from "@material-ui/core";
import { Switch, Paper, Box, Typography, Select, MenuItem } from "@material-ui/core";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import CloseIcon from "@material-ui/icons/Close";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
// import { setVideoMuteStatusDB, setAudioMuteStatusDB } from "../../Modules/eventSessionOperations";
// import { useDocumentData } from "react-firebase-hooks/firestore";
// import firebase from "../../Modules/firebaseApp";
// import { getButtonText } from "../../Utils";
import TechnicalCheckContext from "../../Contexts/TechnicalCheckContext";
import { useMediaDevices } from "react-use";
import { getButtonText } from "../../Utils";
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
    position: "relative",
    overflow: "hidden",
  },
  switchesContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    background: "#00000070"
  },
  switchWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  alert: {
    marginTop: theme.spacing(2),
    textAlign: "center",
  },
  dropIcon: {
    marginRight: theme.spacing(2),
  }
}));

// const WhiteSwitch = withStyles({
//   switchBase: {
//     color: "white",
//     "&$checked": {
//       color: "white",
//     },
//     "&$checked + $track": {
//       backgroundColor: "white",
//     },
//   },
//   checked: {},
//   track: {},
// })(Switch);

const PERMISSION_ERROR_STATUS = {
  BLOCKED: "BLOCKED",
  DISMISSED: "DISMISSED",
  UNKNOWN: "UNKNOWN"
};

const getPermissionStatusForError = (error="") => {
  if (error.toLowerCase().indexOf("denied") !== -1) {
    return PERMISSION_ERROR_STATUS.BLOCKED;
  } else if (error.toLowerCase().indexOf("dismissed") !== -1) {
    return PERMISSION_ERROR_STATUS.DISMISSED;
  } else {
    return PERMISSION_ERROR_STATUS.UNKNOWN;
  }
};

const AudioInputDevicesDropdown = ({ id, inputs, handleChange, selectedInput, renderIconProp }) => {
  const classes = useStyles();
  if (!inputs || inputs.length < 1) {
    return null;
  }
  return (
    <Box 
      marginTop={2}
      paddingLeft={2}
      paddingRight={2}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-around"
      width={"100%"}
    >
      
      {renderIconProp({ className: classes.dropIcon })}

      <Select
        fullWidth
        id={id}
        value={selectedInput ? selectedInput : inputs[0]}
        onChange={handleChange}
      >
        {
          inputs.map((input) => {
            return (
              <MenuItem key={input.deviceId} value={input}>{input.label}</MenuItem>
            )
          })
        }
      </Select>
    </Box>
    
  )
}

const AudioVideoCheckDialog = ({ sessionId, subtitle="", title="Audio/Video Settings", showClose=false, onCloseClicked=()=>{}, overrideShow=false, showModal }) => {
  const styles = useStyles();
  const mediaDevices = useMediaDevices();

  const audioInputs = mediaDevices.devices && mediaDevices.devices.filter(device => device.kind === "audioinput");
  const videoInputs = mediaDevices.devices && mediaDevices.devices.filter(device => device.kind === "videoinput");
  const audioOutputs = mediaDevices.devices && mediaDevices.devices.filter(device => device.kind === "audiooutput");
  
  // const [eventSessionData] = useDocumentData(
  //   firebase
  //   .firestore()
  //   .collection("eventSessions")
  //   .doc(sessionId)
  // )
  const {
    showAudioVideoCheck,
    setShowAudioVideoCheck,
    devicesPermissionGiven,
    enterWithoutPermissions,
    setAudioVideoPermissionFromOutside,
    muteVideo,
    muteAudio,
    setMuteAudio,
    setMuteVideo,
    selectedAudioInput,
    setSelectedAudioInput,
    selectedVideoInput,
    setSelectedVideoInput,
    selectedAudioOutput,
    setSelectedAudioOutput,
  } = useContext(TechnicalCheckContext);

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
    if (overrideShow) {
      onCloseClicked();
    } else {
      setShowAudioVideoCheck(false);
    }
  };


  const handleTryAgain = () => {
    window.location.reload();
  }

  const handleChangeAudioDevice = (event) => {
    console.log(event.target.value);
    setSelectedAudioInput(event.target.value);
  }

  const handleChangeVideoDevice = (event) => {
    setSelectedVideoInput(event.target.value);
  }

  const handleChangeAudioOutputDevice = (event) => {
    setSelectedAudioOutput(event.target.value);
  }

  const VideoSwitch = ({ color = "white", activeColor }) => {
    return (
      <div className={styles.switchWrapper}>
        {muteVideo && <VideocamOffIcon style={{color: color}} />}
        {!muteVideo && <VideocamIcon color={activeColor} />}
        <Switch
          checked={!muteVideo}
          onChange={handleVideoToggle}
          name="mute video"
          color="secondary"
        >
        </Switch>
      </div>
    )
  };

  const AudioSwitch = ({ color = "white", activeColor }) => {
    return (
      <div className={styles.switchWrapper}>
        {muteAudio && <MicOffIcon style={{color: color}} />}
        {!muteAudio && <MicIcon color={activeColor} />}
        <Switch
          checked={!muteAudio}
          onChange={handleAudioToggle}
          name="mute audio"
          color="secondary"
        >
        </Switch>
      </div>
    )
  };


  if (!overrideShow&& !showAudioVideoCheck) {
    return null;
  }

  return (
    // <Paper>
      <Dialog open={overrideShow ? showModal : true} className={styles.dialog} fullWidth maxWidth="xs">
        
        <DialogContent className={styles.dialogContent}>
          <Box marginBottom={1} position="relative" display="flex" width="100%" flexDirection="column" alignItems="center" id="dialog-title">
            <Box marginBottom={1} display="flex" flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">
                {title}
              </Typography>
              {
                showClose && 
                <IconButton onClick={onCloseClicked}>
                  <CloseIcon />
                </IconButton>
              }
            </Box>
            { subtitle && 
              <Typography variant="subtitle1" gutterBottom>
                {subtitle}
              </Typography>
            }          
          </Box>


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


            <div className={styles.switchesContainer}>
              <VideoSwitch activeColor="secondary" />
              <AudioSwitch activeColor="secondary" />
            </div>
          
            {
              (muteAudio || muteVideo) && (
                <Box
                  position="absolute"
                  overflow="hidden"
                  top={0}
                  bgcolor="#00000070"
                  width="100%"
                  color="primary.contrastText"
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  paddingTop={1}
                  paddingBottom={1}
                >
                  <Typography variant={"h6"}>
                    {getButtonText({ muteAudio, muteVideo })}
                  </Typography>
              </Box>
              )
            }

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
                 errorState === PERMISSION_ERROR_STATUS.UNKNOWN && 
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

          <AudioInputDevicesDropdown
            id="audio-in-device-select"
            inputs={audioInputs}
            selectedInput={selectedAudioInput}
            handleChange={handleChangeAudioDevice}
            renderIconProp={({ ...props }) => <MicIcon {...props} />}
          >

          </AudioInputDevicesDropdown>

          <AudioInputDevicesDropdown
            id="video-device-select"
            inputs={videoInputs}
            selectedInput={selectedVideoInput}
            handleChange={handleChangeVideoDevice}
            renderIconProp={({ ...props }) => <VideocamIcon {...props} />}
          >

          </AudioInputDevicesDropdown>

          <AudioInputDevicesDropdown
            id="audio-out-device-select"
            inputs={audioOutputs}
            selectedInput={selectedAudioOutput}
            handleChange={handleChangeAudioOutputDevice}
            renderIconProp={({ ...props }) => <VolumeUpIcon {...props} />}
          >

          </AudioInputDevicesDropdown>

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
                Reload
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
