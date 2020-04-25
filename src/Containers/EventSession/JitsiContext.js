import React from 'react';

const JitsiContext = React.createContext({ jitsiApi: null, setJitsiApi: () => {}});

export default JitsiContext;
