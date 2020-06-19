import React, { useState, useMemo, useContext } from "react";
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
import SmallPlayerIcon from "../../../Assets/Icons/PiP";
import FullscreenPlayerIcon from "../../../Assets/Icons/FullScreen";

import { useSelector, shallowEqual } from "react-redux";
import {
  isParticipantMainStage,
  isParticipantOnCall
} from "../../../Helpers/participantsHelper";
import LeaveCurrentCallDialog from "./LeaveCurrentCallDialog";
import EmptyPaneImg from "../../../Assets/illustrations/emptyPane.svg";
import SmallPlayerContext from "../../../Contexts/SmallPlayerContext";
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
const MainStagePane = ({ setTotalUsers }) => {
  const classes = useStyles();
  const sessionId = useSelector(getSessionId);
  const userSession = useSelector(getUserSession);

  const [isEmpty, setIsEmpty] = useState(true);

  const isUserInMainStage = useMemo(() => isParticipantMainStage(userSession), [
    userSession
  ]);

  const isUserInCall = useMemo(() => isParticipantOnCall(userSession), [
    userSession
  ]);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const { showSmallPlayer, openPlayer, miniPlayerEnabled } = useContext(
    SmallPlayerContext
  );

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

  const enterMainStage = () => {
    setUserCurrentLocation(sessionId, VERTICAL_NAV_OPTIONS.mainStage);
    setConfirmationDialogOpen(false);
  };

  const checkAndEnterMainStage = () => {
    if (isUserInCall) {
      setConfirmationDialogOpen(true);
    } else {
      enterMainStage();
    }
  };

  return (
    <div>
      <LeaveCurrentCallDialog
        open={confirmationDialogOpen}
        setOpen={setConfirmationDialogOpen}
        onConfirmation={enterMainStage}
      />
      {!isUserInMainStage && (
        <div className={classes.buttonContainer}>
          {!miniPlayerEnabled && (
            <Button
              variant="contained"
              color="primary"
              onClick={checkAndEnterMainStage}
            >
              Enter {mainStageTitle}
            </Button>
          )}
          {miniPlayerEnabled && (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={checkAndEnterMainStage}
                startIcon={<FullscreenPlayerIcon />}
              >
                Open {mainStageTitle}
              </Button>

              {miniPlayerEnabled && !showSmallPlayer && (
                <Tooltip title={`View ${mainStageTitle} in a small player`}>
                  <IconButton
                    /* size="small" */ color="primary"
                    onClick={openPlayer}
                    style={{ marginLeft: 16 }}
                  >
                    <SmallPlayerIcon />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </div>
      )}
      <AttendeesPane
        paneFilter={ATTENDEES_PANE_FILTER.mainStage}
        setIsEmptyPane={setIsEmpty}
        setTotalUsers={setTotalUsers}
      />
      {isEmpty && (
        <Box className={classes.emptyPane}>
          <img
            className={classes.emptyImage}
            src={EmptyPaneImg}
            alt="Empty Main Stage"
          />
          <Typography variant="body2" color="textSecondary" display="block">
            There's no one on the {mainStageTitle}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default MainStagePane;
