import React from "react";

export const VERTICAL_NAV_OPTIONS = {
  lobby: "LOBBY",
  mainStage: "MAIN_STAGE",
  rooms: "ROOMS",
  networking: "NETWORKING",
  attendees: "ATTENDEES",
  chat: "CHAT",
  polls: "POLLS",
  qna: "QNA"
};

const VerticalNavBarContext = React.createContext({
  currentNavBarSelection: VERTICAL_NAV_OPTIONS.lobby,
  setCurrentNavBarSelection: () => {},
  hasNavBarPaneOpen: false,
  setHasNavBarPaneOpen: () => {}
});

export default VerticalNavBarContext;
