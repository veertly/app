import React from "react";
import useJitsi from "../../Hooks/useJitsi";
import { makeStyles, useTheme, Typography } from "@material-ui/core";
import { JITSI_MEET_SDK_URL } from "../../Modules/jitsi";
import useScript from "../../Hooks/useScript";
import { ReactComponent as ServerDown } from "../../Assets/illustrations/undraw_server_down.svg";

const useStyles = makeStyles((theme) => ({
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
    backgroundColor: "white",
    "& > * + *": {
      marginTop: theme.spacing(1)
    }
  }
}));

const ErrorComponent= () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <div className={classes.errorContainer}>
      <ServerDown
        height="40%"
        width="40%"
        fill={theme.palette.primary.main}
      />
      {/* <Typography variant="h6" >
        Server configuration is wrong. Please contact the organizer or Veertly team
      </Typography> */}
      <Typography align="center" gutterBottom style={{ paddingTop: 16 }}>
        It seems the video-conferencing system is down or not configured
        correctly...
      </Typography>
      <Typography variant="caption" display="block" align="center">
        Please contact the event organizer or Veertly team
      </Typography>
      {/* <img
        alt="Not available"
        src={NoVideoImage}
        className={classes.noVideoImage}
      /> */}
    </div>
  );
}

const JitsiPlayerComponent = ({
  avatarUrl,
  displayName,
  sessionId,
  // containerId,
  domain,
  showJitsiLogo,
  subject,
  roomName,
  onVideoConferenceJoined = () => {},
  onVideoConferenceLeft = () => {},
  callEndedCb = () => {},
  jitsiServer = JITSI_MEET_SDK_URL
}) => {
  const [loaded, error] = useScript(jitsiServer);

  const classes = useStyles();
  useJitsi({
    avatarUrl,
    displayName,
    sessionId,
    containerId: "#conference-container",
    domain,
    showJitsiLogo,
    subject,
    roomName,
    onVideoConferenceJoined,
    onVideoConferenceLeft,
    callEndedCb,
    jitsiServer
  });
  if (!loaded) return <div id="conference-container">Loading...</div>;

  if (error) {
    return (
      <ErrorComponent />
    )
  }
  return <div id="conference-container" className={classes.root} />;
};

class JitsiPlayerComponentWithError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }
  render () {
    if (this.state.hasError) {
      return (
        <ErrorComponent />
      )
    }
    return (
      <JitsiPlayerComponent {...this.props} />
    )
  }
 
}

export default JitsiPlayerComponentWithError;
