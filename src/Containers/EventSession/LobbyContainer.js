import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { FEATURES } from "../../Modules/features";
import {
  getFeatureDetails,
  getEventSessionDetails,
  getSessionId
} from "../../Redux/eventSession";
import { VERTICAL_NAV_OPTIONS } from "../../Contexts/VerticalNavBarContext";
import EventPage from "../../Components/Event/EventPage";
import { Button, Box } from "@material-ui/core";
import { setUserCurrentLocation } from "../../Modules/userOperations";

export const LobbyContainer = () => {
  const customNavBarFeature = useSelector(
    getFeatureDetails(FEATURES.CUSTOM_NAV_BAR),
    shallowEqual
  );

  const mainStageTitle = useMemo(() => {
    if (
      customNavBarFeature &&
      customNavBarFeature[VERTICAL_NAV_OPTIONS.mainStage]
    ) {
      return customNavBarFeature[VERTICAL_NAV_OPTIONS.mainStage].label;
    }
    return "Main Stage";
  }, [customNavBarFeature]);

  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  const sessionId = useSelector(getSessionId);

  return (
    <Box mb={2.5}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            setUserCurrentLocation(sessionId, VERTICAL_NAV_OPTIONS.mainStage)
          }
          style={{ marginBottom: 24 }}
        >
          Enter {mainStageTitle}
        </Button>
      </div>
      <EventPage
        event={eventSessionDetails}
        hideButtons={true}
        isPreview={true}
      />
    </Box>
  );
};
