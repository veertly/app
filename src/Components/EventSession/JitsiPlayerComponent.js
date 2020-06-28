import React from "react";
import useJitsi from "../../Hooks/useJitsi";
import { makeStyles } from "@material-ui/core";
import { JITSI_MEET_SDK_URL } from "../../Modules/jitsi";

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
  jitsiServer=JITSI_MEET_SDK_URL,
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
    jitsiServer,
  });

  return (
    <div id="conference-container" className={classes.root} />
  )
};

export default JitsiPlayerComponent;
