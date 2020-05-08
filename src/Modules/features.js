export const FEATURES = {
  RSVP: "rsvp",
  TICKETS: "tickets",
  MINI_PLAYER: "miniplayer",
  PASSWORD_PROTECTED: "passwordprotected",
};

export const getFeatureDetails = (enabledFeatures, feature) => {
  return enabledFeatures ? enabledFeatures[feature] : null;
};
