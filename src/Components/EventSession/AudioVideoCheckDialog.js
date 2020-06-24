import React, { useState, useContext, useEffect } from "react";

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
import { useMediaDevices, useMountedState, usePrevious, useAudio } from "react-use";
import { getButtonText } from "../../Utils";
import JitsiContext from "../../Contexts/JitsiContext";
// import { useMediaDevices } from "react-use";
import testSound from "../../Sounds/testSound.mp3";

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

const getObjectFromId = (id, devices) => {
  if (!devices || !id) {
    return "";
  };

  if (!Array.isArray(devices)) {
    return "";
  }

  return devices.filter((device) => (device.deviceId === id))[0];
}

const getPermissionStatusForError = (error="") => {
  if (error.toLowerCase().indexOf("denied") !== -1) {
    return PERMISSION_ERROR_STATUS.BLOCKED;
  } else if (error.toLowerCase().indexOf("dismissed") !== -1) {
    return PERMISSION_ERROR_STATUS.DISMISSED;
  } else {
    return PERMISSION_ERROR_STATUS.UNKNOWN;
  }
};

const BrowserDevicesDropdown = ({ id, inputs, handleChange, selectedInput, renderIconProp, showTestAudio=false }) => {
  const classes = useStyles();
 
  
  const [audio, state, controls, ref] = useAudio({ // eslint-disable-line no-unused-vars
    src: testSound,
    autoPlay: false,
  });

  if (!inputs || inputs.length < 1) {
    return (
      <>
        {audio}
      </>
    );
  }

  return (
    <Box
      marginTop={2}
      paddingLeft={2}
      paddingRight={2}
      width={"100%"}
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      <Box 
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
          value={selectedInput ? selectedInput.deviceId : inputs[0].deviceId}
          onChange={handleChange}
        >
          {
            inputs.map((input) => {
              return (
                <MenuItem key={input.deviceId} value={input.deviceId}>{input.label}</MenuItem>
              )
            })
          }
        </Select>
      </Box>
      {audio}
      {
        showTestAudio && (
        <>
          <Button
            color="primary"
            size="small"
            onClick={() => {
              controls.play()
            }}>
            Play test Sound
          </Button>
        </>
        )
      }

    </Box>
    
  )
}

const AudioVideoCheckDialog = ({
  subtitle="",
  title="Audio/Video Settings",
  showClose=false,
  onCloseClicked=()=>{},
  overrideShow=false,
  showModal,
  okText="Join Event",
}) => {
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
  const isMounted = useMountedState();

  const { jitsiApi } = useContext(JitsiContext);

  const [calledTimes, setCalledTimes] = useState(0);

  const previousShowModal = usePrevious(showModal);

  // As jitsi does not have a device change listener, so this serves as a workaround
  // This ensures selected device is changed in our context  
  useEffect(() => {
    const setCorrectDevices = async () => {
      if (jitsiApi && showModal && isMounted && calledTimes < 1) {
        const devices = await jitsiApi.getCurrentDevices();
        
        const jitsiSelectedAudioInput = devices.audioInput;
        const jitsiSelectedVideoInput = devices.videoInput;
        const jitsiSelectedAudioOutput = devices.audioOutput;

        if (selectedAudioInput.label !== jitsiSelectedAudioInput.label) {
          const correctSelectedAudioInput = audioInputs.filter(input => input.label === jitsiSelectedAudioInput.label);
          setSelectedAudioInput(correctSelectedAudioInput[0]);
        }

        if (selectedVideoInput.label !== jitsiSelectedVideoInput.label) {
          const correctSelectedVideoInput = videoInputs.filter(input => input.label === jitsiSelectedVideoInput.label);
          setSelectedVideoInput(correctSelectedVideoInput[0]);
        }

        if (selectedAudioOutput.label !== jitsiSelectedAudioOutput.label) {
          const correctSelectedAudioOutput = audioOutputs.filter(input => input.label === jitsiSelectedAudioOutput.label);
          setSelectedAudioOutput(correctSelectedAudioOutput[0]);
        }
        setCalledTimes(time => time + 1);
      }  
    }
    setCorrectDevices();
  }, [
    showModal,
    jitsiApi,
    selectedAudioInput.label,
    selectedVideoInput.label,
    selectedAudioOutput.label,
    audioInputs,
    setSelectedAudioInput,
    setSelectedVideoInput,
    setSelectedAudioOutput,
    videoInputs,
    audioOutputs,
    isMounted,
    calledTimes
  ]);
  // const muteVideo = useSelector(getMuteVideoOnEnter)
  // const muteAudio = useSelector(getMuteAudioOnEnter);


  useEffect(() => {
    if (previousShowModal && showModal !== previousShowModal) {
      setCalledTimes(0);
    }
  }, [showModal, previousShowModal])

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
    const device = getObjectFromId(event.target.value, audioInputs);
    setSelectedAudioInput(device);
  }

  const handleChangeVideoDevice = (event) => {
    const device = getObjectFromId(event.target.value, videoInputs)
    setSelectedVideoInput(device);
  }

  const handleChangeAudioOutputDevice = (event) => {
    const device = getObjectFromId(event.target.value, audioOutputs)
    setSelectedAudioOutput(device);
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
          <Box mt={1.5} />
          <BrowserDevicesDropdown
            id="audio-in-device-select"
            inputs={audioInputs}
            selectedInput={selectedAudioInput}
            handleChange={handleChangeAudioDevice}
            renderIconProp={({ ...props }) => <MicIcon {...props} />}
          >

          </BrowserDevicesDropdown>

          <BrowserDevicesDropdown
            id="video-device-select"
            inputs={videoInputs}
            selectedInput={selectedVideoInput}
            handleChange={handleChangeVideoDevice}
            renderIconProp={({ ...props }) => <VideocamIcon {...props} />}
          >

          </BrowserDevicesDropdown>

          <BrowserDevicesDropdown
            id="audio-out-device-select"
            inputs={audioOutputs}
            selectedInput={selectedAudioOutput}
            handleChange={handleChangeAudioOutputDevice}
            showTestAudio={true}
            renderIconProp={({ ...props }) => <VolumeUpIcon {...props} />}
          >

          </BrowserDevicesDropdown>

          {
            devicesPermissionGiven && 
            <Button
            className={styles.button}
            onClick={handleClickPreview}
            // type="submit"
            variant="contained"
            color="primary"
            >
              {okText}
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
