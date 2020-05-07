import { useEffect, useState } from "react";
import useScript from "./useScript";

const useJitsi = ({
  avatarUrl,
  displayName,
  sessionId,
  conferenceVideoType,
  containerId,
  jitsiApi,
  setJitsiApi,
  callEndedCb,
}) => {
  // const { jitsiApi, setJitsiApi } = useState(null);

  const [loaded] = useScript("https://meet.jit.si/external_api.js");
  const [lastRoomLoaded, setLastRoomLoaded] = useState(null);

  useEffect(() => {

    if (!displayName) {
      return;
    }

    const prefix = process.env.REACT_APP_JITSI_ROOM_PREFIX;
    const prefixStr = prefix !== undefined ? `-${prefix}-` : "";

    const roomName = `veertly${prefixStr}-${sessionId}`;

    if (conferenceVideoType === "JITSI" && loaded && lastRoomLoaded !== roomName) {
      // dispose existing jitsi
      if (jitsiApi) {
        jitsiApi.executeCommand("hangup");
        jitsiApi.dispose();
      }

      const domain = "meet.jit.si";
      const options = {
        roomName,
        parentNode: document.querySelector(containerId),
        interfaceConfigOverwrite: {
          // filmStripOnly: true,
          DEFAULT_REMOTE_DISPLAY_NAME: "Veertlier",
          // SHOW_JITSI_WATERMARK: false,
          // SUPPORT_URL: 'https://github.com/jitsi/jitsi-meet/issues/new',
        },
      };

      // TRY: You can disable it as follows: use a URL like so https://meet.jit.si/test123#config.p2p.enabled=false

      // eslint-disable-next-line no-undef
      const api = new JitsiMeetExternalAPI(domain, options);
      /* eslint-enable no-undef */
      api.executeCommand("displayName", displayName);
      if (avatarUrl) {
        api.executeCommand("avatarUrl", avatarUrl);
      }
      api.addEventListener("videoConferenceLeft", (event) => {
        // console.log("videoConferenceLeft: ", event);
        if (callEndedCb) {
          callEndedCb(event);
        }
        // handleCallEnded();
      });
      api.addEventListener("readyToClose", (event) => {
        // console.log("readyToClose: ", event);
        if (callEndedCb) {
          callEndedCb(event);
        }
        // handleCallEnded();
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
  }, [loaded, jitsiApi, setJitsiApi, displayName, avatarUrl, sessionId, conferenceVideoType, lastRoomLoaded, callEndedCb, containerId]);

  return jitsiApi;
};

export default useJitsi;
