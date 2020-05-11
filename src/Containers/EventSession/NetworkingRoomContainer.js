import React, { useState, useEffect, useContext } from "react";
import useScript from "../../Hooks/useScript";
import { makeStyles } from "@material-ui/core/styles";
import { leaveCall } from "../../Modules/eventSessionOperations";

import { useSelector, shallowEqual } from "react-redux";
import {
  getUser,
  getUserGroup,
  getSessionId,
  getUserId,
  getEventSessionDetails
} from "../../Redux/eventSession";
import JitsiContext from "./JitsiContext";
import { trackPage, trackEvent } from "../../Modules/analytics";
import { getJistiServer, getJitsiOptions } from "../../Modules/jitsi";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%"
  }
}));

export default () => {
  const classes = useStyles();
  const { jitsiApi, setJitsiApi } = useContext(JitsiContext);
  const [lastRoomLoaded, setLastRoomLoaded] = useState(null);

  const userId = useSelector(getUserId);
  const user = useSelector(getUser);
  const currentGroup = useSelector(getUserGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);

  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const [loaded, error] = useScript(
    (currentGroup && currentGroup.customJitsiServer
      ? getJistiServer(currentGroup)
      : getJistiServer(eventSessionDetails)) + "external_api.js"
  );

  useEffect(() => {
    trackPage("NetworkingRoom/" + sessionId);
    trackEvent("Entered Networking Room", {
      eventSessionId: sessionId
    });
  }, [sessionId]);

  const handleCallEnded = React.useCallback(() => {
    leaveCall(sessionId, currentGroup, userId);
  }, [sessionId, currentGroup, userId]);

  useEffect(() => {
    let prefix = process.env.REACT_APP_JITSI_ROOM_PREFIX;
    let prefixStr = prefix !== undefined ? `${prefix}-` : "";

    const roomName =
      prefixStr +
      currentGroup.videoConferenceAddress.replace("https://meet.jit.si/", "");

    if (loaded && lastRoomLoaded !== roomName) {
      // dispose existing jitsi
      if (jitsiApi) {
        jitsiApi.executeCommand("hangup");
        jitsiApi.dispose();
      }

      const domain =
        currentGroup && currentGroup.customJitsiServer
          ? getJistiServer(currentGroup)
          : getJistiServer(eventSessionDetails);

      const options = getJitsiOptions(
        roomName,
        document.querySelector("#conference-container")
      );

      /*eslint-disable no-undef*/
      const api = new JitsiMeetExternalAPI(domain, options);
      /*eslint-enable no-undef*/
      api.executeCommand("displayName", user.firstName + " " + user.lastName);
      if (currentGroup.isRoom) {
        api.executeCommand("subject", `Veertly | ${currentGroup.roomName}`);
      } else {
        api.executeCommand("subject", "Veertly | Networking Conversation");
      }

      if (user.avatarUrl) {
        api.executeCommand("avatarUrl", user.avatarUrl);
      }
      api.addEventListener("videoConferenceLeft", (event) => {
        // console.log("videoConferenceLeft: ", event);
        trackEvent("[Jitsi] Left Call (videoConferenceLeft)", {
          eventSessionId: sessionId,
          roomName
        });
        handleCallEnded();
      });
      api.addEventListener("readyToClose", (event) => {
        // console.log("readyToClose: ", event);
        trackEvent("[Jitsi] Left Call (readyToClose)", {
          eventSessionId: sessionId,
          roomName
        });
        handleCallEnded();
      });
      trackEvent("[Jitsi] Joined Call", {
        eventSessionId: sessionId,
        roomName
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
  }, [
    loaded,
    currentGroup,
    sessionId,
    handleCallEnded,
    jitsiApi,
    lastRoomLoaded,
    setJitsiApi,
    user,
    eventSessionDetails
  ]);

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
