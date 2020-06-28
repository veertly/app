import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Switch,
  FormControlLabel,
  Tooltip,
  Box,
  Typography
} from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  getUserSession,
  getUserAvailableForCall,
  getSessionId
} from "../../Redux/eventSession";
import { participantCanNetwork } from "../../Helpers/participantsHelper";
import { setUserAvailableForCall } from "../../Modules/userOperations";
import useIsMobile from "../../Hooks/useIsMobile";

const useStyles = makeStyles((theme) => ({
  label: {
    opacity:0.5,
  },
}));

const PresenceSwitch = () => {
  const classes = useStyles();
  const sessionId = useSelector(getSessionId);
  const userSession = useSelector(getUserSession);
  const isAvailableForCall = useSelector(getUserAvailableForCall);
  const canNetwork = participantCanNetwork(userSession);
  const isMobile = useIsMobile();
  const [switchValue, setSwitchValue] = useState(isAvailableForCall === true);

  useEffect(() => {
    if (isAvailableForCall !== switchValue) {
      setSwitchValue(isAvailableForCall === true);
    }
  }, [isAvailableForCall, setSwitchValue, switchValue]);

  const handleChange = (e) => {
    const value = e.target.checked;
    setSwitchValue(value);
    setUserAvailableForCall(sessionId, value);
  };

  if (isMobile) {
    return null;
  }
  return (
    <div>
      {canNetwork && (
        <Tooltip
          title={
            switchValue ? "Available to network" : "Not available to network"
          }
        >
          <FormControlLabel
            label={switchValue ? "Available" : "Do not disturb"}
            control={<Switch checked={switchValue} onChange={handleChange} />}
            labelPlacement="start"
          />
        </Tooltip>
      )}
      {!canNetwork && (
        <Tooltip title="While in a conversation, you will not be interrupted">
          <Box display="flex" flex="row" alignItems="center">
            <Typography className={classes.label} variant="subtitle1">{switchValue ? "Available" : "Do not disturb"}</Typography>
            <Switch checked={switchValue} onChange={handleChange} disabled />
          </Box>
          {/* <FormControlLabel
            // label={"In a conversation"}
            className={classes.label}
            label={switchValue ? "Available" : "Do not disturb"}
            control={<Switch checked={switchValue} onChange={handleChange} />}
            labelPlacement="start"
            disabled
          /> */}
        </Tooltip>
      )}
    </div>
  );
};

export default PresenceSwitch;
