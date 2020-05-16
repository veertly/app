export const FEATURES = {
  RSVP: "rsvp",
  TICKETS: "tickets",
  MINI_PLAYER: "miniplayer",
  PASSWORD_PROTECTED: "passwordProtected"
};

export const getFeatureDetails = (enabledFeatures, feature) => {
  return enabledFeatures && enabledFeatures[feature]
    ? enabledFeatures[feature]
    : null;
};
