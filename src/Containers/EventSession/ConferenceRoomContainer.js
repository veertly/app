import React, { useState, useEffect } from "react";
import useScript from "../../Hooks/useScript";
import { makeStyles } from "@material-ui/core/styles";
import { leaveCall } from "../../Modules/eventSessionOperations";
import NoVideoImage from "../../Assets/illustrations/undraw_video_call_kxyp.svg";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%"
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  noVideoImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    position: "absolute",
    bottom: 0,
    margin: "auto",
    width: "100%",
    height: "60%"
  }
}));

export default props => {
  const classes = useStyles();
  const { user, eventSession, jitsiApi, setJitsiApi } = props;
  const [loaded, error] = useScript("https://meet.jit.si/external_api.js");
  const [lastRoomLoaded, setLastRoomLoaded] = useState(null);

  useEffect(() => {
    window.analytics.page("ConferenceRoom/" + eventSession.id);
  }, []);

  const handleCallEnded = () => {
    leaveCall(eventSession, user.uid);
  };

  useEffect(() => {
    let prefix = process.env.REACT_APP_JITSI_ROOM_PREFIX;
    let prefixStr = prefix !== undefined ? `-${prefix}-` : "";

    const roomName = "veertly" + prefixStr + "-" + eventSession.id;

    if (eventSession.conferenceVideoType === "JITSI" && loaded && lastRoomLoaded !== roomName) {
      // dispose existing jitsi
      if (jitsiApi) {
        jitsiApi.executeCommand("hangup");
        jitsiApi.dispose();
      }

      const domain = "meet.jit.si";
      const options = {
        roomName: roomName,
        parentNode: document.querySelector("#conference-container"),
        interfaceConfigOverwrite: {
          // filmStripOnly: true,
          DEFAULT_REMOTE_DISPLAY_NAME: "Veertlier"
          // SHOW_JITSI_WATERMARK: false,
          // SUPPORT_URL: 'https://github.com/jitsi/jitsi-meet/issues/new',
        }
      };
      /*eslint-disable no-undef*/

      // TRY: You can disable it as follows: use a URL like so https://meet.jit.si/test123#config.p2p.enabled=false

      const api = new JitsiMeetExternalAPI(domain, options);
      /*eslint-enable no-undef*/
      api.executeCommand("displayName", user.displayName);
      if (user.photoURL) {
        api.executeCommand("avatarUrl", user.photoURL);
      }
      api.addEventListener("videoConferenceLeft", event => {
        console.log("videoConferenceLeft: ", event);
        handleCallEnded();
      });
      api.addEventListener("readyToClose", event => {
        console.log("readyToClose: ", event);
        handleCallEnded();
      });

      setLastRoomLoaded(roomName);
      setJitsiApi(api);
    }
    return () => {
      // if (jitsiApi) {
      //   console.log("ON DISPOSE");
      //   jitsiApi.executeCommand("hangup");
      //   jitsiApi.dispose();
      // }
    };
  }, [loaded]);

  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }
  if (!loaded) return <div id="conference-container">Loading...</div>;
  if (loaded) {
    const getYoutubeFrame = videoId => {
      return (
        <iframe
          className={classes.videoContainer}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&fs=0&modestbranding=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="livestream"
        ></iframe>
      );
    };
    switch (eventSession.conferenceVideoType) {
      case "YOUTUBE":
        let videoId = eventSession.conferenceRoomYoutubeVideoId;
        return getYoutubeFrame(videoId);

      case "JITSI":
        return <div id="conference-container" className={classes.root} />;
      default:
        return (
          <div className={classes.videoContainer}>
            <Typography align="center" gutterBottom style={{ marginTop: 64 }}>
              Livestream not correctly configured...
            </Typography>
            <Typography variant="caption" display="block" align="center">
              Please contact the event organizer or Veertly team
            </Typography>
            <img alt="No Video available" src={NoVideoImage} className={classes.noVideoImage} />
          </div>
        );
    }
    // return (
    //   <div className={classes.root}>
    //     <Typography variant="caption">
    //       <pre>
    //         <code>{JSON.stringify(currentGroup, null, 2)}</code>
    //       </pre>
    //     </Typography>
    //   </div>
    // );
  }
};
