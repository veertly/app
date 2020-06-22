import React, { useState } from "react";
import useMuteAudioVideo from "../Hooks/useMuteAudioVideo";
import useShowTechCheck from "../Hooks/useShowTechCheck";

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

  selectedAudioInput: "",
  setSelectedAudioInput: () => {},
  selectedVideoInput: "",
  setSelectedVideoInput: () => {},
  selectedAudioOutput: "",
  setSelectedAudioOutput: () => {},

});


export const TechnicalCheckProvider = ({ sessionId, ...props }) => {
  const { showAudioVideoCheck, setShowAudioVideoCheck, devicesPermissionGiven, enterWithoutPermissions, setAudioVideoPermissionFromOutside } = useShowTechCheck(sessionId);
  const { muteVideo, muteAudio, setMuteAudio, setMuteVideo } = useMuteAudioVideo(sessionId);

  const [selectedAudioInput, setSelectedAudioInput] = useState("");
  const [selectedVideoInput, setSelectedVideoInput] = useState("");
  const [selectedAudioOutput, setSelectedAudioOutput] = useState("");

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
        selectedAudioInput,
        selectedVideoInput,
        selectedAudioOutput,
        setSelectedVideoInput,
        setSelectedAudioOutput,
        setSelectedAudioInput,
      }}
      {...props}
    />
  )
};

export default TechnicalCheckContext;
