export const FEATURES = {
  RSVP: "rsvp",
  TICKETS: "tickets",
  MINI_PLAYER: "miniplayer",
  PASSWORD_PROTECTED: "passwordProtected",
  REMOVE_JITSI_LOGO: "removeJitsiLogo",
  CUSTOM_NAV_BAR: "customNavBar",
  CUSTOM_THEME: "customTheme",
  STREAMYARD_BACKSTAGE: "streamYardBackstage"
};

export const getFeatureDetails = (enabledFeatures, feature) => {
  return enabledFeatures && enabledFeatures[feature]
    ? enabledFeatures[feature]
    : null;
};
