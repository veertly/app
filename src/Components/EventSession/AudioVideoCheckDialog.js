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
import { Switch, Paper, Box, Typography } from "@material-ui/core";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import CloseIcon from "@material-ui/icons/Close";
import TechnicalCheckContext from "../../Contexts/TechnicalCheckContext";
import { getButtonText } from "../../Utils";
import DevicesOptions from "./DevicesOptions";

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
    marginTop: theme.spacing(2)
  },
  enterWithoutButton : {
    width: "90%",
    alignSelf: "center",
    marginTop: theme.spacing(2)
  },
  needHelpButton: {
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
  },
  whiteTextContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    background: "#bdbdbd"
  },
  whiteText: {
    paddingTop: theme.spacing(0.8),
    paddingBottom: theme.spacing(0.8),
  }
}));

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
    selectedVideoInput,
  } = useContext(TechnicalCheckContext);

  const [showAlert, setShowAlert] = useState(false);
  const [errorState, setErrorState] = useState(PERMISSION_ERROR_STATUS.UNKNOWN);

  const handleVideoToggle = () => {
    setMuteVideo(!muteVideo);
  };

  const handleAudioToggle = () => {
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

  const videoConstraint = {
    deviceId: selectedVideoInput,
  };

  const handleNeedHelpClicked = () => {
    // window.$crisp.push(["do", "chat:open"]);
    window.open(
      "https://go.crisp.chat/chat/embed/?website_id=e2d77fef-388b-4609-a944-238bdcc2fc70",
      "_blank"
    );
  };

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
              videoConstraints={videoConstraint}
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
            
            { muteVideo &&
              <Box
                top="0"
                left="0"
                position="absolute"
                bgcolor="#f5f5f5"
                height="100%"
                width="100%"
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <VideocamOffIcon style={{fontSize: 32, flex: 1}} color="primary" />
              </Box>
            }

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
              <Box
                top="0"
                left="0"
                position="absolute"
                bgcolor="#f5f5f5"
                height="100%"
                width="100%"
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <VideocamOffIcon style={{fontSize: 32, flex: 1}} color="primary" />
                <Box 
                  flex={0.2}
                  width="100%"
                  className={styles.whiteTextContainer}>
                    <Typography className={styles.whiteText}>
                      Please give access to audio and video
                    </Typography>
                </Box>
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

          {devicesPermissionGiven &&
            <DevicesOptions 
              showModal={showModal}
            />
            
          }

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
            
              <Button
                className={styles.needHelpButton}
                variant="primary"
                onClick={handleNeedHelpClicked}>
                Need help?
              </Button>
            </>
            
          }

        </DialogContent>
      </Dialog>
    // </Paper>
  )
};

export default AudioVideoCheckDialog;
