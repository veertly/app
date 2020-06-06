import { useLocalStorage } from "react-use";

const TECH_CHECK_EXPIRATION = 2 * 60 * 60 * 1000;

const useShowTechCheck = (sessionId) => {
  const [techCheckState, setTechCheckState] = useLocalStorage("vrtly_show_tech_check", {});

  // also check for some sort of time here.
  // we don't want to show check everytime but we do want tot show check when user is coming back some other daty
  // show by default
  const showTechCheckForSession = techCheckState[sessionId] &&
    techCheckState[sessionId].lastUpdate + TECH_CHECK_EXPIRATION > Date.now()  ? techCheckState[sessionId].show : true;

  const setTechCheckForSession = (show) => {
    setTechCheckState({
      ...techCheckState,
      [sessionId]: {
        show: show,
        lastUpdate: Date.now(),
      }
    })
  }

  return [
    showTechCheckForSession,
    setTechCheckForSession
  ]  
};

export default useShowTechCheck;