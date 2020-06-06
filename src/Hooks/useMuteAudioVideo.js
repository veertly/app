import { useLocalStorage } from "react-use";

const useMuteAudioVideo = (sessionId) => {
  // const [muteAudioInternal, setMuteAudioInternal] = useLocalStorage("vrtly_mute_audio", {});
  // const [muteVideoInternal, setMuteVideoInternal] = useLocalStorage("vrtly_mute_video", {});
  
  const [muteAudioVideoState, setMuteAudioVideoState] = useLocalStorage("vrtly_mute_audio_video_state", {});
  const muteAudio = muteAudioVideoState && muteAudioVideoState[sessionId] ? muteAudioVideoState[sessionId].muteAudio : false;
  const muteVideo = muteAudioVideoState && muteAudioVideoState[sessionId] ? muteAudioVideoState[sessionId].muteVideo : false;
  
  const previousState = muteAudioVideoState && muteAudioVideoState[sessionId] ? muteAudioVideoState[sessionId] : {};
  const setMuteAudio = (muteAudioValueBool) => {
    // console.log(previousState);
    setMuteAudioVideoState({
      ...muteAudioVideoState,
      [sessionId]: {
        ...previousState,
        muteAudio: muteAudioValueBool
      }
    });
  };

  const setMuteVideo = (muteVideoValueBool) => {
    // const previousState = muteAudioVideoState && muteAudioVideoState.sessionId ? muteAudioVideoState.sessionId : {};
    setMuteAudioVideoState({
      ...muteAudioVideoState,
      [sessionId]: {
        ...previousState,
        muteVideo: muteVideoValueBool,
      }
    });
  };

  return {
    muteAudio,
    muteVideo,
    setMuteAudio,
    setMuteVideo,
  }
};

export default useMuteAudioVideo;
