import React, { useEffect, useState } from "react";
import {
  // makeStyles,
  Switch,
  FormControlLabel,
  Tooltip
} from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  getUserSession,
  getUserAvailableForCall,
  getSessionId
} from "../../Redux/eventSession";
import { participantCanNetwork } from "../../Helpers/participantsHelper";
import { setUserAvailableForCall } from "../../Modules/userOperations";

// const useStyles = makeStyles((theme) => ({
//   emptyPane: {
//     marginTop: theme.spacing(4),
//     textAlign: "center"
//   },
//   emptyImage: {
//     width: "55%",
//     marginBottom: theme.spacing(1)
//   }
// }));
const PresenceSwitch = () => {
  // const classes = useStyles();
  const sessionId = useSelector(getSessionId);
  const userSession = useSelector(getUserSession);
  const isAvailableForCall = useSelector(getUserAvailableForCall);
  const canNetwork = participantCanNetwork(userSession);

  const [switchValue, setSwitchValue] = useState(isAvailableForCall);

  useEffect(() => {
    if (isAvailableForCall !== switchValue) {
      setSwitchValue(isAvailableForCall);
    }
  }, [isAvailableForCall, setSwitchValue, switchValue]);

  const handleChange = (e) => {
    const value = e.target.checked;
    setSwitchValue(value);
    setUserAvailableForCall(sessionId, value);
  };

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
    </div>
  );
};

export default PresenceSwitch;
