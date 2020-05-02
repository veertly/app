import React from 'react';

const JitsiContext = React.createContext({
  jitsiApi: null,
  setJitsiApi: () => {},
  showSmallPayer: true,
  setShowSmallPlayer: () => {},
});

export default JitsiContext;
