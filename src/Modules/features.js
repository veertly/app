export const FEATURES = {
  RSVP: "rsvp",
  TICKETS: "tickets",
  MINI_PLAYER: "miniplayer",
};

export const getFeatureDetails = (enabledFeatures, feature) => {
  return enabledFeatures ? enabledFeatures[feature] : null;
};
