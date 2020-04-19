import React, { useState, useEffect } from "react";
import useScript from "../../Hooks/useScript";
import { makeStyles } from "@material-ui/core/styles";
import { leaveCall } from "../../Modules/eventSessionOperations";

import { useSelector, shallowEqual } from "react-redux";
import { getUser, getUserGroup, getSessionId, getUserId } from "../../Redux/eventSession";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
}));

export default (props) => {
  const classes = useStyles();
  const { /* currentGroup, user, eventSession, */ jitsiApi, setJitsiApi } = props;
  const [loaded, error] = useScript("https://meet.jit.si/external_api.js");
  const [lastRoomLoaded, setLastRoomLoaded] = useState(null);

  const userId = useSelector(getUserId);
  const user = useSelector(getUser);
  const currentGroup = useSelector(getUserGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);

  useEffect(() => {
    window.analytics.page("NetworkingRoom/" + sessionId);
    window.analytics.track("Entered Networking Room", {
      eventSessionId: sessionId,
    });
  }, [sessionId]);

  const handleCallEnded = React.useCallback(() => {
    leaveCall(sessionId, currentGroup, userId);
  }, [sessionId, currentGroup, userId]);

  useEffect(() => {
    let prefix = process.env.REACT_APP_JITSI_ROOM_PREFIX;
    let prefixStr = prefix !== undefined ? `${prefix}-` : "";

    const roomName = prefixStr + currentGroup.videoConferenceAddress.replace("https://meet.jit.si/", "");

    if (loaded && lastRoomLoaded !== roomName) {
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
          DEFAULT_REMOTE_DISPLAY_NAME: "Veertlier",
          // SHOW_JITSI_WATERMARK: false,
          // SUPPORT_URL: 'https://github.com/jitsi/jitsi-meet/issues/new',
        },
      };
      /*eslint-disable no-undef*/
      const api = new JitsiMeetExternalAPI(domain, options);
      /*eslint-enable no-undef*/
      api.executeCommand("displayName", user.firstName + " " + user.lastName);
      if (user.avatarUrl) {
        api.executeCommand("avatarUrl", user.avatarUrl);
      }
      api.addEventListener("videoConferenceLeft", (event) => {
        // console.log("videoConferenceLeft: ", event);
        window.analytics.track("[Jitsi] Left Call (videoConferenceLeft)", {
          eventSessionId: sessionId,
          roomName,
        });
        handleCallEnded();
      });
      api.addEventListener("readyToClose", (event) => {
        // console.log("readyToClose: ", event);
        window.analytics.track("[Jitsi] Left Call (readyToClose)", {
          eventSessionId: sessionId,
          roomName,
        });
        handleCallEnded();
      });
      window.analytics.track("[Jitsi] Joined Call", {
        eventSessionId: sessionId,
        roomName,
      });
      setLastRoomLoaded(roomName);
      setJitsiApi(api);
    }
    return () => {
      //TODO: correctly handle the leaving of calls
      // if (jitsiApi) {
      //   console.log("ON DISPOSE");
      //   jitsiApi.executeCommand("hangup");
      //   jitsiApi.dispose();
      // }
    };
  }, [loaded, currentGroup, sessionId, handleCallEnded, jitsiApi, lastRoomLoaded, setJitsiApi, user]);

  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }
  if (!loaded) return <div id="conference-container">Loading...</div>;
  if (loaded) {
    // return (
    //   <div className={classes.root}>
    //     <Typography variant="caption">
    //       <pre>
    //         <code>{JSON.stringify(currentGroup, null, 2)}</code>
    //       </pre>
    //     </Typography>
    //   </div>
    // );
    return <div id="conference-container" className={classes.root} />;
  }
};
