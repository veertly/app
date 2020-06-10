import React from "react";
import useShowTechCheck from "../../Hooks/useShowTechCheck";
import useMuteAudioVideo from "../../Hooks/useMuteAudioVideo";
import TechnicalCheckContext from "./TechnicalCheckContext";

const TechnicalCheckProvider = ({ sessionId, ...props }) => {
  const { showAudioVideoCheck, setShowAudioVideoCheck, devicesPermissionGiven, enterWithoutPermissions, setAudioVideoPermissionFromOutside } = useShowTechCheck(sessionId);
  const { muteVideo, muteAudio, setMuteAudio, setMuteVideo } = useMuteAudioVideo(sessionId);

  return (
    <TechnicalCheckContext.Provider
      value={{
        showAudioVideoCheck,
        setShowAudioVideoCheck,
        devicesPermissionGiven,
        enterWithoutPermissions,
        setAudioVideoPermissionFromOutside,
        muteVideo,
        muteAudio,
        setMuteAudio,
        setMuteVideo,
      }}
      {...props}
    />
  )
};

export default TechnicalCheckProvider;
