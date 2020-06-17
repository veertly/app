import React, { useState, useMemo } from "react";
import { makeStyles, Button } from "@material-ui/core";
import VerticalNavBarContext, {
  VERTICAL_NAV_OPTIONS
} from "../../../Contexts/VerticalNavBarContext";
import { setUserCurrentLocation } from "../../../Modules/userOperations";
import {
  getSessionId,
  getUserSession,
  getEventSessionDetails,
  getFeatureDetails
} from "../../../Redux/eventSession";
import { useSelector, shallowEqual } from "react-redux";
import {
  isParticipantLobby,
  isParticipantOnCall
} from "../../../Helpers/participantsHelper";
import EventPage from "../../Event/EventPage";
import LeaveCurrentCallDialog from "./LeaveCurrentCallDialog";
import { FEATURES } from "../../../Modules/features";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    position: "sticky",
    top: -8,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    backgroundColor: "#fff",
    zIndex: 2
  },
  emptyPane: {
    marginTop: theme.spacing(4),
    textAlign: "center"
  },
  emptyImage: {
    width: "70%",
    marginBottom: theme.spacing(1)
  }
}));
const LobbyPane = () => {
  const classes = useStyles();
  const sessionId = useSelector(getSessionId);
  const userSession = useSelector(getUserSession);
  const eventSessionDetails = useSelector(getEventSessionDetails);

  const isUserInLobby = useMemo(() => isParticipantLobby(userSession), [
    userSession
  ]);

  const isUserInCall = useMemo(
    () => isParticipantOnCall(userSession, eventSessionDetails),
    [eventSessionDetails, userSession]
  );

  const customNavBarFeature = useSelector(
    getFeatureDetails(FEATURES.CUSTOM_NAV_BAR),
    shallowEqual
  );

  const lobyTitle = useMemo(() => {
    if (
      customNavBarFeature &&
      customNavBarFeature[VERTICAL_NAV_OPTIONS.lobby]
    ) {
      return customNavBarFeature[VERTICAL_NAV_OPTIONS.lobby].label;
    }
    return "Lobby";
  }, [customNavBarFeature]);

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const { setHasNavBarPaneOpen } = React.useContext(VerticalNavBarContext);

  const enterLobby = () => {
    setUserCurrentLocation(sessionId, VERTICAL_NAV_OPTIONS.lobby);
    setHasNavBarPaneOpen(false);
    setConfirmationDialogOpen(false);
  };

  const checkAndEnterLobby = () => {
    if (isUserInCall) {
      setConfirmationDialogOpen(true);
    } else {
      enterLobby();
    }
  };

  return (
    <div>
      <LeaveCurrentCallDialog
        open={confirmationDialogOpen}
        setOpen={setConfirmationDialogOpen}
        onConfirmation={enterLobby}
      />
      {!isUserInLobby && (
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={checkAndEnterLobby}
          >
            Enter {lobyTitle}
          </Button>
        </div>
      )}
      <EventPage
        event={eventSessionDetails}
        hideButtons={true}
        isPreview={true}
        isSmallContainer={true}
        hideBanner={true}
      />
    </div>
  );
};

export default LobbyPane;
