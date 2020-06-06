import React from "react";

const JitsiContext = React.createContext({
  jitsiApi: null,
  setJitsiApi: () => {},
  showSmallPayer: true,
  setShowSmallPlayer: () => {},
  miniPlayerEnabled: false,
  muteAudio: false,
  muteVideo: false,
  setMuteAudio: () => {},
  setMuteVideo: () => {},
});

export default JitsiContext;
