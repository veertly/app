import React from "react";

const JitsiContext = React.createContext({
  jitsiApi: null,
  setJitsiApi: () => {},
  showSmallPayer: true,
  setShowSmallPlayer: () => {},
  miniPlayerEnabled: false,
});

export default JitsiContext;
