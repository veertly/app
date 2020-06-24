import { useLocalStorage, useMediaDevices } from "react-use";
import { useState, useEffect } from "react";
import { SHOW_TECH_CHECK_LOCAL_STORAGE } from "../Utils/constants";

// Time after which the page refresh will show the preview dialog 
// TODO: increase it. right now its 6 hours
const TECH_CHECK_EXPIRATION = 6 * 60 * 60 * 1000;

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
  const [techCheckState, setTechCheckState] = useLocalStorage(SHOW_TECH_CHECK_LOCAL_STORAGE, {});

  // Permission api in chrome are experimental right now
  // const microphone = usePermission({ name: "microphone" });
  // const camera = usePermission({ name: "camera" });
  const devicesObj = useMediaDevices();
  // console.log(devicesObj);
  // const {stream, error} = useMediaStream();
  const [blockForMediaPermission, setBlockForAudioPermission] = useState(true);
  const [showTechCheckForSession, setShowTechCheckForSession] = useState(false);
  // const [blockForVideoPermission, setBlockForVideoPermission] = useState(false);
  // const [blockForAudioPermission, setBlockForAudioPermission] = useState(false);

  const [videoPermission, setVideoPermission] = useState(true);
  const [audioPermission, setAudioPermission] = useState(true);
 

  useEffect(() => {
    setVideoPermission(isVideoPermissionGiven(devicesObj.devices));
    setAudioPermission(isAudioPermissionGiven(devicesObj.devices));
  }, [devicesObj])

  // const videoPermission = !error && stream;
  // const audioPermission = !error && stream;
 
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

  // Using it when we are actually getting stream in webcam.
  // This helps us to update the permission given variable in realtime when permission is given by user after asking
  const setAudioVideoPermissionFromOutside = (mediaPermission) => {
    setAudioPermission(mediaPermission);
    setVideoPermission(mediaPermission);
  }  

  return {
    showAudioVideoCheck: showTechCheckForSession,
    setShowAudioVideoCheck: setTechCheckForSession,
    // is devices permission given
    devicesPermissionGiven: videoPermission && audioPermission,
    enterWithoutPermissions,
    setAudioVideoPermissionFromOutside,
  } 
};

export default useShowTechCheck;