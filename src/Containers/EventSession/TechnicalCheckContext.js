import React from "react";

const TechnicalCheckContext = React.createContext({
  showAudioVideoCheck: false,
  setShowAudioVideoCheck: () => {},
  devicesPermissionGiven: true,
  enterWithoutPermissions: true,
  setAudioVideoPermissionFromOutside: () => {},
  muteAudio: false,
  muteVideo: false,
  setMuteAudio: () => {},
  setMuteVideo: () => {},
});

export default TechnicalCheckContext;
