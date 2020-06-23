import { useEffect, useState, useContext } from "react";
import useScript from "./useScript";
import { getJitsiOptions } from "../Modules/jitsi";
import TechnicalCheckContext from "../Contexts/TechnicalCheckContext";
import { usePrevious } from "react-use";
import JitsiContext from "../Contexts/JitsiContext";

const useJitsi = ({
  avatarUrl,
  displayName,
  sessionId,
  conferenceVideoType="JITSI",
  containerId,
  // jitsiApi,
  // setJitsiApi,
  domain="meet.jit.si",
  showJitsiLogo,
  subject="",
  roomName,
  onVideoConferenceJoined=()=> {},
  onVideoConferenceLeft=()=>{},
  callEndedCb=()=>{},
}) => {
  const { jitsiApi, setJitsiApi } = useContext(JitsiContext);

  const [loaded] = useScript("https://meet.jit.si/external_api.js");
  const [lastRoomLoaded, setLastRoomLoaded] = useState(null);

  const { muteVideo, muteAudio, setMuteAudio, setMuteVideo, selectedAudioInput, selectedVideoInput, selectedAudioOutput  } = useContext(TechnicalCheckContext);

  const previousMuteVideo = usePrevious(muteVideo);
  const previousMuteAudio = usePrevious(muteAudio);

  useEffect(() => {

    if (!displayName) {
      return;
    }

    if (conferenceVideoType === "JITSI" && loaded && lastRoomLoaded !== roomName) {
      // dispose existing jitsi
      if (jitsiApi) {
        jitsiApi.executeCommand("hangup");
        jitsiApi.dispose();
      }

      const options = getJitsiOptions(
        roomName,
        document.querySelector(containerId),
        true,
        true,
        showJitsiLogo
      );

      // eslint-disable-next-line no-undef
      const api = new JitsiMeetExternalAPI(domain, options);

      /* eslint-enable no-undef */
      api.executeCommand("displayName", displayName);
      api.executeCommand("subject", subject);
      if (avatarUrl) {
        api.executeCommand("avatarUrl", avatarUrl);
      }

      if (muteAudio) {
        api.executeCommand("toggleAudio");
      }

      if (muteVideo) {
        api.executeCommand("toggleVideo");
      }

      if (selectedAudioInput) {
        api.setAudioInputDevice(selectedAudioInput.label)
      }

      if (selectedVideoInput) {
        api.setVideoInputDevice(selectedVideoInput.label)
      }

      if (selectedAudioOutput) {
        api.setAudioOutputDevice(selectedAudioOutput.label);
      }

      api.addEventListener("audioMuteStatusChanged", (event) => {
        console.log("mute audio => ",event);
        setMuteAudio((audioMute) => {
          console.log()
          return event.muted
        })
      });
      
      api.addEventListener("videoMuteStatusChanged", (event) => {
        setMuteVideo(event.muted);
      });

      api.addEventListener("videoConferenceLeft", (event) => {
        if (callEndedCb) {
          onVideoConferenceLeft(event);
        }
      });

      api.addEventListener("videoConferenceJoined", (event) => {
        if (callEndedCb) {
          onVideoConferenceJoined(event);
        }
      });

      api.addEventListener("readyToClose", (event) => {
        if (callEndedCb) {
          callEndedCb(event);
        }
      });

      setLastRoomLoaded(roomName);
      setJitsiApi(api);
    }
    return () => {};
  }, [loaded, jitsiApi, setJitsiApi, displayName, avatarUrl, sessionId, conferenceVideoType, lastRoomLoaded, containerId, showJitsiLogo, domain, subject, roomName, muteAudio, muteVideo, callEndedCb, onVideoConferenceLeft, onVideoConferenceJoined, selectedAudioInput, selectedAudioOutput, selectedVideoInput, setMuteAudio, setMuteVideo]);

  useEffect(() => {
    if (jitsiApi) {   
      if (previousMuteVideo !== muteVideo) {
        jitsiApi.executeCommand("toggleVideo");
      } 
    }
  }, [
    jitsiApi,
    muteVideo,
    previousMuteVideo
  ]);

  useEffect(() => {
    if (jitsiApi) {  
      if (previousMuteAudio !== muteAudio) {
        jitsiApi.executeCommand("toggleAudio");   
      }  
    }
  }, [
    jitsiApi,
    muteAudio,
    previousMuteAudio
  ]);

  useEffect(() => {
    if (jitsiApi) {  
      jitsiApi.setAudioInputDevice(selectedAudioInput.label)
    }
  }, [
    selectedAudioInput,
    jitsiApi
  ]);

  useEffect(() => {
    if (jitsiApi) {  
      jitsiApi.setAudioOutputDevice(selectedAudioOutput.label)
    }
  }, [
    selectedAudioOutput,
    jitsiApi
  ]);

  useEffect(() => {
    if (jitsiApi) {  
      jitsiApi.setVideoInputDevice(selectedVideoInput.label)
    }
  }, [
    selectedVideoInput,
    jitsiApi
  ]);

  return jitsiApi;
};

export default useJitsi;
