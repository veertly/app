import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { FEATURES } from "../../Modules/features";
import { getFeatureDetails } from "../../Redux/eventSession";
import { VERTICAL_NAV_OPTIONS } from "../../Contexts/VerticalNavBarContext";
import { makeStyles, Typography } from "@material-ui/core";

import NoVideoImage from "../../Assets/illustrations/undraw_video_call_kxyp.svg";

const useStyles = makeStyles((theme) => ({
  videoContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white"
  },
  noVideoImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    position: "absolute",
    bottom: 0,
    margin: "auto",
    width: "100%",
    height: "40%"
  }
}));

const BackstageContainer = () => {
  const classes = useStyles();

  const customNavBarFeature = useSelector(
    getFeatureDetails(FEATURES.CUSTOM_NAV_BAR),
    shallowEqual
  );

  const backstageFeature = useSelector(
    getFeatureDetails(FEATURES.STREAMYARD_BACKSTAGE),
    shallowEqual
  );

  const backstageStageTitle = useMemo(() => {
    if (
      customNavBarFeature &&
      customNavBarFeature[VERTICAL_NAV_OPTIONS.backstage]
    ) {
      return customNavBarFeature[VERTICAL_NAV_OPTIONS.backstage].label;
    }
    return "Backstage";
  }, [customNavBarFeature]);

  const streamYardLink = useMemo(
    () =>
      backstageFeature &&
      backstageFeature.enabled &&
      backstageFeature.streamYardLink.trim() !== ""
        ? backstageFeature.streamYardLink.trim()
        : null,
    [backstageFeature]
  );

  if (!backstageFeature || !backstageFeature.enabled) {
    return (
      <div className={classes.videoContainer}>
        <Typography align="center" gutterBottom style={{ paddingTop: 100 }}>
          {backstageStageTitle} not configured correctly...
        </Typography>
        <Typography variant="caption" display="block" align="center">
          Please contact the event organizer or Veertly team
        </Typography>
        <img
          alt="Not available"
          src={NoVideoImage}
          className={classes.noVideoImage}
        />
      </div>
    );
  }
  return (
    <div className={classes.videoContainer}>
      <iframe
        src={streamYardLink}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="camera;microphone"
        title={backstageStageTitle}
      />
    </div>
  );
};
export default BackstageContainer;
