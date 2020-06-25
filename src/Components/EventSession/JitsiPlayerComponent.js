import React from "react";
import useJitsi from "../../Hooks/useJitsi";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(()=> ({
  root: {
    width: "100%",
    height: "100%"
  },
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
}) => {
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
  });

  return (
    <div id="conference-container" className={classes.root} />
  )
};

export default JitsiPlayerComponent;
