import React from "react";

export const VERTICAL_NAV_OPTIONS = {
  lobby: "LOBBY",
  mainStage: "MAIN_STAGE",
  rooms: "ROOMS",
  attendees: "ATTENDEES",
  chat: "CHAT",
  polls: "POLLS"
};

const VerticalNavBarContext = React.createContext({
  currentNavBarSelection: VERTICAL_NAV_OPTIONS.lobby,
  setCurrentNavBarSelection: () => {}
});

export default VerticalNavBarContext;
