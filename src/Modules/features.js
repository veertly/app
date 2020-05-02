export const FEATURES = {
  RSVP: "rsvp",
  TICKETS: "tickets",
};

export const getFeatureDetails = (enabledFeatures, feature) => {
  return enabledFeatures ? enabledFeatures[feature] : null;
};
