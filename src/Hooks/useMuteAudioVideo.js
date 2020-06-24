import { useState, useEffect } from "react";
import { useLocalStorage } from "react-use";
import { VEERTLY_MUTE_AUDIO_STATES, VEERTLY_MUTE_VIDEO_STATES } from "../Utils/constants";

const useMuteAudioVideo = (sessionId) => {

  const [muteAudioObject, setMuteAudioInternal] = useLocalStorage(VEERTLY_MUTE_AUDIO_STATES, {});
  const [muteVideoObject, setMuteVideoInternal] = useLocalStorage(VEERTLY_MUTE_VIDEO_STATES, {});

  const [muteAudio, setMuteAudio] = useState(muteAudioObject[sessionId] ? muteAudioObject[sessionId] : false);
  const [muteVideo, setMuteVideo] = useState(muteVideoObject[sessionId] ? muteVideoObject[sessionId] : false);
  
  
  useEffect(() => {
    setMuteAudioInternal((internalState) => {
      return {
        ...internalState,
        [sessionId]: muteAudio
      }
    });
  }, [muteAudio, sessionId, setMuteAudioInternal]);


  useEffect(() => {
    setMuteVideoInternal((internalState) => {
      return {
        ...internalState,
        [sessionId]: muteVideo
      }
    });
  }, [muteVideo, sessionId, setMuteVideoInternal]);

  return {
    muteAudio,
    muteVideo,
    setMuteAudio,
    setMuteVideo,
  }
};

export default useMuteAudioVideo;
