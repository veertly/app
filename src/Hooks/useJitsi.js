import { useEffect, useState, useContext } from "react";
import useScript from "./useScript";
import { getJitsiOptions, DEFAULT_JITSI_SERVER, JITSI_MEET_SDK_URL } from "../Modules/jitsi";
import TechnicalCheckContext from "../Contexts/TechnicalCheckContext";
import { usePrevious } from "react-use";
import JitsiContext from "../Contexts/JitsiContext";

const useJitsi = ({
  avatarUrl,
  displayName,
  sessionId,
  containerId,
  domain=DEFAULT_JITSI_SERVER,
  showJitsiLogo,
  subject="",
  roomName,
  onVideoConferenceJoined=()=> {},
  onVideoConferenceLeft=()=>{},
  callEndedCb=()=>{},
}) => {
  const { jitsiApi, setJitsiApi } = useContext(JitsiContext);

  const [loaded] = useScript(JITSI_MEET_SDK_URL);
  const [lastRoomLoaded, setLastRoomLoaded] = useState(null);

  const { showAudioVideoCheck ,muteVideo, muteAudio, setMuteAudio, setMuteVideo, selectedAudioInput, selectedVideoInput, selectedAudioOutput  } = useContext(TechnicalCheckContext);

  const previousMuteVideo = usePrevious(muteVideo);
  const previousMuteAudio = usePrevious(muteAudio);

  useEffect(() => {

    if (!displayName) {
      return;
    }

    if (showAudioVideoCheck) {
      return;
    }

    if (loaded && lastRoomLoaded !== roomName) {
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
        setMuteAudio(event.muted)
      });
      
      api.addEventListener("videoMuteStatusChanged", (event) => {
        setMuteVideo(event.muted);
      });

      api.addEventListener("videoConferenceLeft", (event) => {
        if (onVideoConferenceLeft) {
          onVideoConferenceLeft(event);
        }
      });

      api.addEventListener("videoConferenceJoined", (event) => {
        if (onVideoConferenceJoined) {
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
  }, [
    showAudioVideoCheck,
    loaded,
    jitsiApi,
    setJitsiApi,
    displayName,
    avatarUrl,
    sessionId,
    lastRoomLoaded,
    containerId,
    showJitsiLogo,
    domain,
    subject,
    roomName,
    muteAudio,
    muteVideo,
    callEndedCb,
    onVideoConferenceLeft,
    onVideoConferenceJoined,
    selectedAudioInput,
    selectedAudioOutput,
    selectedVideoInput,
    setMuteAudio,
    setMuteVideo
  ]);

  useEffect(() => {
    const toggleInternal = async () => {
      if (jitsiApi) {   
        if (previousMuteVideo !== muteVideo) {
          const playerVideoMuted = await jitsiApi.isVideoMuted();
          if (playerVideoMuted !== muteVideo) {
            jitsiApi.executeCommand("toggleVideo");
          }
        } 
      }
    }
    toggleInternal();
  }, [
    jitsiApi,
    muteVideo,
    previousMuteVideo
  ]);

  useEffect(() => {
    const toggleInternal = async () => {
      if (jitsiApi) { 
        if (previousMuteAudio !== muteAudio) {
          const playerAudioMuted = await jitsiApi.isAudioMuted();
          if (playerAudioMuted !== muteAudio) {
            jitsiApi.executeCommand("toggleAudio");   
          }
        }   
      }
    }
    toggleInternal();
  }, [
    jitsiApi,
    muteAudio,
    previousMuteAudio
  ]);

  useEffect(() => {
    if (jitsiApi && selectedAudioInput) {
      jitsiApi.setAudioInputDevice(selectedAudioInput.label)
    }
  }, [
    selectedAudioInput,
    jitsiApi
  ]);

  useEffect(() => {
    if (jitsiApi && selectedAudioOutput) {  
      jitsiApi.setAudioOutputDevice(selectedAudioOutput.label)
    }
  }, [
    selectedAudioOutput,
    jitsiApi
  ]);

  useEffect(() => {
    if (jitsiApi && selectedVideoInput) {  
      jitsiApi.setVideoInputDevice(selectedVideoInput.label)
    }
  }, [
    selectedVideoInput,
    jitsiApi
  ]);


  const previousJitsiAPI = usePrevious(jitsiApi);

  // dispose the instance if a user is changing from the on jitsi call to another
  // Earlier it was gc'd if it was
  useEffect(() => {
    if (previousJitsiAPI && previousJitsiAPI !== jitsiApi) {
      previousJitsiAPI.executeCommand("hangup");
      previousJitsiAPI.dispose();
    }
  }, [previousJitsiAPI, jitsiApi]);


  return jitsiApi;
};

export default useJitsi;
