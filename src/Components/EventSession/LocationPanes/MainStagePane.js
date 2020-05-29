import React, { useState, useMemo } from "react";
import { makeStyles, Button, Typography, Box } from "@material-ui/core";
import AttendeesPane, { ATTENDEES_PANE_FILTER } from "./AttendeesPane";
import { VERTICAL_NAV_OPTIONS } from "../../../Contexts/VerticalNavBarContext";
import { setUserCurrentLocation } from "../../../Modules/userOperations";
import { getSessionId, getUserSession } from "../../../Redux/eventSession";
import { useSelector } from "react-redux";
import {
  isParticipantMainStage,
  isParticipantOnCall
} from "../../../Helpers/participantsHelper";
import LeaveCurrentCallDialog from "./LeaveCurrentCallDialog";

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
const MainStagePane = () => {
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
          <Button
            variant="contained"
            color="primary"
            onClick={checkAndEnterMainStage}
          >
            Enter Main Stage
          </Button>
        </div>
      )}
      <AttendeesPane
        paneFilter={ATTENDEES_PANE_FILTER.mainStage}
        setIsEmptyPane={setIsEmpty}
      />
      {isEmpty && (
        <Box className={classes.emptyPane}>
          <img
            className={classes.emptyImage}
            src="/illustrations/emptyPane.svg"
            alt="Empty Main Stage"
          />
          <Typography variant="body2" color="textSecondary" display="block">
            There's no one in the main stage
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default MainStagePane;
