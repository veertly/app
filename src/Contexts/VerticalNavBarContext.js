import React from "react";

export const VERTICAL_NAV_OPTIONS = {
  lobby: "LOBBY",
  mainStage: "MAIN_STAGE",
  rooms: "ROOMS",
  networking: "NETWORKING",
  attendees: "ATTENDEES",
  chat: "CHAT",
  polls: "POLLS",
  qna: "QNA",
  broadcasts: "BROADCASTS",
  backstage: "BACKSTAGE",
  help: "HELP"
};

const VerticalNavBarContext = React.createContext({
  currentNavBarSelection: VERTICAL_NAV_OPTIONS.lobby,
  setCurrentNavBarSelection: () => {},
  hasNavBarPaneOpen: false,
  setHasNavBarPaneOpen: () => {}
});

export default VerticalNavBarContext;

export const VerticalNavBarContextWrapper = ({ children }) => {
  const [currentNavBarSelection, setCurrentNavBarSelection] = React.useState(
    VERTICAL_NAV_OPTIONS.lobby
  );
  const [hasNavBarPaneOpen, setHasNavBarPaneOpen] = React.useState(false);
  return (
    <VerticalNavBarContext.Provider
      value={{
        currentNavBarSelection,
        setCurrentNavBarSelection,
        hasNavBarPaneOpen,
        setHasNavBarPaneOpen
      }}
    >
      {children}
    </VerticalNavBarContext.Provider>
  );
};
