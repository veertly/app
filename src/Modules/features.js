export const FEATURES = {
  RSVP: "rsvp",
};

export const getFeatureDetails = (enabledFeatures, feature) => {
  return enabledFeatures ? enabledFeatures[feature] : null;
};
