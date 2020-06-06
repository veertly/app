import { useLocalStorage, useMediaDevices } from "react-use";
import { useState, useEffect } from "react";

// 15 Minutes
const TECH_CHECK_EXPIRATION = 15 * 60 * 1000;

const isVideoPermissionGiven = (devices) => {
  let permisssionGiven = true;
  if (devices && Array.isArray(devices)) {
    const videoDevices = devices.filter((device) => {
      return device.kind === "videoinput";
    });
    permisssionGiven = videoDevices[0] && !!videoDevices[0].label;
  }
  return permisssionGiven;
}

const isAudioPermissionGiven = (devices) => {
  let permisssionGiven = true;
  if (devices && Array.isArray(devices)) {
    const audioDevices = devices.filter((device) => {
      return device.kind === "audioinput";
    });
    permisssionGiven = audioDevices[0] && !!audioDevices[0].label;
  }
  return permisssionGiven;
}

const useShowTechCheck = (sessionId) => {
  const [techCheckState, setTechCheckState] = useLocalStorage("vrtly_show_tech_check", {});

  // Permission api in chrome are experimental right now
  // const microphone = usePermission({ name: "microphone" });
  // const camera = usePermission({ name: "camera" });
  const devicesObj = useMediaDevices();

  const [blockForMediaPermission, setBlockForAudioPermission] = useState(true);
  const [showTechCheckForSession, setShowTechCheckForSession] = useState(false);
  // const [blockForVideoPermission, setBlockForVideoPermission] = useState(false);
  // const [blockForAudioPermission, setBlockForAudioPermission] = useState(false);


  const videoPermission = isVideoPermissionGiven(devicesObj.devices);
  const audioPermission = isAudioPermissionGiven(devicesObj.devices);
 
  
  useEffect(() => {
    let showTechCheckForSessionTemp = true;
    if (techCheckState[sessionId] && techCheckState[sessionId].lastUpdate + TECH_CHECK_EXPIRATION > Date.now()) {
      if (blockForMediaPermission) {
        if (videoPermission && audioPermission) {
          showTechCheckForSessionTemp = techCheckState[sessionId].show 
        }
      } else {
        showTechCheckForSessionTemp = techCheckState[sessionId].show
      }
    }
    
    setShowTechCheckForSession(showTechCheckForSessionTemp)

  }, [techCheckState, audioPermission, videoPermission, blockForMediaPermission, sessionId])

  const setTechCheckForSession = (show) => {
    setTechCheckState({
      ...techCheckState,
      [sessionId]: {
        show: show,
        lastUpdate: Date.now(),
      }
    });
    setBlockForAudioPermission(false);
  }

  const enterWithoutPermissions = () => {
    setTechCheckState({
      ...techCheckState,
      [sessionId]: {
        show: false,
        lastUpdate: Date.now(),
      }
    });
    setBlockForAudioPermission(false);
  }

  return {
    showAudioVideoCheck: showTechCheckForSession,
    setShowAudioVideoCheck: setTechCheckForSession,
    // is devices permission given
    devicesPermissionGiven: videoPermission && audioPermission,
    enterWithoutPermissions,
  } 
};

export default useShowTechCheck;