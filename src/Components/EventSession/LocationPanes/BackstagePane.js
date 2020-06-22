import React, { useState, useMemo } from "react";
import {
  makeStyles,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip
} from "@material-ui/core";
import AttendeesPane, { ATTENDEES_PANE_FILTER } from "./AttendeesPane";
import { VERTICAL_NAV_OPTIONS } from "../../../Contexts/VerticalNavBarContext";
import { setUserCurrentLocation } from "../../../Modules/userOperations";
import {
  getSessionId,
  getUserSession,
  getFeatureDetails
} from "../../../Redux/eventSession";
import NewWindowIcon from "../../../Assets/Icons/NewWindow";
import FullscreenPlayerIcon from "../../../Assets/Icons/FullScreen";

import { useSelector, shallowEqual } from "react-redux";
import {
  isParticipantOnCall,
  isParticipantBackstage
} from "../../../Helpers/participantsHelper";
import LeaveCurrentCallDialog from "./LeaveCurrentCallDialog";
import EmptyPaneImg from "../../../Assets/illustrations/emptyPane.svg";
import { FEATURES } from "../../../Modules/features";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    position: "sticky",
    top: -8,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
const BackstagePane = ({ setTotalUsers }) => {
  const classes = useStyles();
  const sessionId = useSelector(getSessionId);
  const userSession = useSelector(getUserSession);

  const [isEmpty, setIsEmpty] = useState(true);

  const isUserInBackstage = useMemo(() => isParticipantBackstage(userSession), [
    userSession
  ]);

  const isUserInCall = useMemo(() => isParticipantOnCall(userSession), [
    userSession
  ]);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const customNavBarFeature = useSelector(
    getFeatureDetails(FEATURES.CUSTOM_NAV_BAR),
    shallowEqual
  );

  const backstageTitle = useMemo(() => {
    if (
      customNavBarFeature &&
      customNavBarFeature[VERTICAL_NAV_OPTIONS.backstage]
    ) {
      return customNavBarFeature[VERTICAL_NAV_OPTIONS.backstage].label;
    }
    return "Backstage";
  }, [customNavBarFeature]);

  const enterBackstage = () => {
    setUserCurrentLocation(sessionId, VERTICAL_NAV_OPTIONS.backstage);
    setConfirmationDialogOpen(false);
  };

  const checkAndEnterBackstage = () => {
    if (isUserInCall) {
      setConfirmationDialogOpen(true);
    } else {
      enterBackstage();
    }
  };

  const backstageFeature = useSelector(
    getFeatureDetails(FEATURES.STREAMYARD_BACKSTAGE),
    shallowEqual
  );

  const streamYardLink = useMemo(
    () =>
      backstageFeature &&
      backstageFeature.enabled &&
      backstageFeature.streamYardLink.trim() !== ""
        ? backstageFeature.streamYardLink.trim()
        : null,
    [backstageFeature]
  );

  const openAnotherWindow = () => {
    if (streamYardLink) {
      window.open(streamYardLink, "_blank");
    }
  };
  return (
    <div>
      <LeaveCurrentCallDialog
        open={confirmationDialogOpen}
        setOpen={setConfirmationDialogOpen}
        onConfirmation={enterBackstage}
      />
      <div className={classes.buttonContainer}>
        {/* 
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={checkAndEnterBackstage}
          >
            Enter {backstageTitle}
          </Button>
        </div>
      )} */}
        {!isUserInBackstage && (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={checkAndEnterBackstage}
              startIcon={<FullscreenPlayerIcon />}
            >
              Enter {backstageTitle}
            </Button>
            <Tooltip title={`Open ${backstageTitle} in another window`}>
              <IconButton
                /* size="small" */ color="primary"
                onClick={openAnotherWindow}
                style={{ marginLeft: 16 }}
                disabled={streamYardLink === null}
              >
                <NewWindowIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
        {isUserInBackstage && (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={openAnotherWindow}
              startIcon={<NewWindowIcon />}
            >
              Open in new window
            </Button>
          </>
        )}
      </div>
      <AttendeesPane
        paneFilter={ATTENDEES_PANE_FILTER.backstage}
        setIsEmptyPane={setIsEmpty}
        setTotalUsers={setTotalUsers}
      />
      {isEmpty && (
        <Box className={classes.emptyPane}>
          <img
            className={classes.emptyImage}
            src={EmptyPaneImg}
            alt="Empty Backstage"
          />
          <Typography variant="body2" color="textSecondary" display="block">
            There's no one on the {backstageTitle}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default BackstagePane;
