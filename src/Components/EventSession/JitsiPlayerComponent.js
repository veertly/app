import React from "react";
import useJitsi from "../../Hooks/useJitsi";
import { makeStyles, useTheme, Typography } from "@material-ui/core";
import { JITSI_MEET_SDK_URL } from "../../Modules/jitsi";
import useScript from "../../Hooks/useScript";
import { ReactComponent as ServerDown } from "../../Assets/illustrations/undraw_server_down.svg";

const useStyles = makeStyles((theme)=> ({
  root: {
    width: "100%",
    height: "100%"
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    "& > * + *" : {
      marginTop: theme.spacing(1),
    },
  }
}));

const JitsiPlayerComponent =({
  avatarUrl,
  displayName,
  sessionId,
  // containerId,
  domain,
  showJitsiLogo,
  subject,
  roomName,
  onVideoConferenceJoined=()=> {},
  onVideoConferenceLeft=()=>{},
  callEndedCb=()=>{},
  jitsiServer=JITSI_MEET_SDK_URL,
}) => {

  const [loaded, error] = useScript(
    jitsiServer
  );

  const classes = useStyles();
  useJitsi({
    avatarUrl,
    displayName,
    sessionId,
    containerId:"#conference-container",
    domain,
    showJitsiLogo,
    subject,
    roomName,
    onVideoConferenceJoined,
    onVideoConferenceLeft,
    callEndedCb,
    jitsiServer,
  });
  const theme = useTheme();
  if (!loaded) return (
    <div id="conference-container">Loading...</div>
  );
  if (error) {
    return (
      <div className={classes.errorContainer}>
        <ServerDown height="50%" width="50%" fill={theme.palette.primary.main} />
        <Typography variant="h6" >
          Server configuration is wrong. Please contact the organizer or Veertly team
        </Typography>
      </div>
    )
  }
  return (
    <div id="conference-container" className={classes.root} />
  )
};

export default JitsiPlayerComponent;
