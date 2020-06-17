import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  getFeatureDetails,
  getUserCurrentLocation,
  getEventSessionDetails,
  getSessionId
} from "../Redux/eventSession";
import { FEATURES } from "../Modules/features";
import { VERTICAL_NAV_OPTIONS } from "./VerticalNavBarContext";
import { useLocalStorage } from "react-use";

const SmallPlayerContext = React.createContext({
  showSmallPayer: true,
  setShowSmallPlayer: () => {},
  miniPlayerEnabled: false
});

export default SmallPlayerContext;

export const SmallPlayerContextProvider = ({ children }) => {
  // const [jitsiApi, setJitsiApi] = useState(null);
  const [showSmallPlayer, setShowSmallPlayer] = useState(true);

  const sessionId = useSelector(getSessionId);

  const [maximized, setMaximized] = useLocalStorage(
    `veertly/${sessionId}/player-maximized`,
    true
  );

  // const [minimized, setMinimized] = useState(false);
  // const [maximized, setMaximized] = useState(true);

  // const [miniPlayerEnabled, setMiniPlayerEnabled] = useState(false);

  const userCurrentLocation = useSelector(getUserCurrentLocation, shallowEqual);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const inMainStage = React.useMemo(
    () => userCurrentLocation === VERTICAL_NAV_OPTIONS.mainStage,
    [userCurrentLocation]
  );

  const miniPlayerFeature = useSelector(
    getFeatureDetails(FEATURES.MINI_PLAYER),
    shallowEqual
  );

  const miniPlayerEnabled = React.useMemo(
    () =>
      miniPlayerFeature &&
      miniPlayerFeature.enabled &&
      eventSessionDetails.conferenceVideoType !== "JITSI",
    [eventSessionDetails.conferenceVideoType, miniPlayerFeature]
  );

  useEffect(() => {
    if (!miniPlayerEnabled || inMainStage) {
      setShowSmallPlayer(false);
    } else {
      setShowSmallPlayer(maximized);
    }
  }, [
    eventSessionDetails.conferenceVideoType,
    inMainStage,
    maximized,
    miniPlayerEnabled
  ]);

  const minimizePlayer = () => {
    setMaximized(false);
    setShowSmallPlayer(false);
  };

  const openPlayer = () => {
    setMaximized(true);
    setShowSmallPlayer(true);
  };

  return (
    <SmallPlayerContext.Provider
      value={{
        showSmallPlayer,
        minimizePlayer,
        openPlayer,
        miniPlayerEnabled
      }}
    >
      {children}
    </SmallPlayerContext.Provider>
  );
};
