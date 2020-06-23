import { useState, useEffect } from "react";
import { useLocalStorage } from "react-use";

const useMuteAudioVideo = (sessionId) => {

  const [muteAudioObject, setMuteAudioInternal] = useLocalStorage("vrtly_mute_audio_state", {});
  const [muteVideoObject, setMuteVideoInternal] = useLocalStorage("vrtly_mute_video_state", {});

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
