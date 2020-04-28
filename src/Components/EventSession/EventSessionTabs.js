import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AvailableParticipantsIcon from "../../Assets/Icons/AvailableParticipants";
import ConversationsIcon from "../../Assets/Icons/Conversations";
import ConversationsTab from "./ConversationsTab";
import AvailableTab from "./AvailableTab";
import CurrentCallActions from "./CurrentCallActions";
import { useSelector, shallowEqual } from "react-redux";
import { getUserGroup } from "../../Redux/eventSession";
import SmallPlayerContainer from "../../Containers/EventSession/SmallPlayerContainer";

const CALL_SECTION_HEIGHT = 110;

const PLAYER_HEIGHT = Math.floor(0.3 * window.innerHeight);
const MIN_PLAYER_HEIGHT = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 300,
    position: "relative",
  },
  tab: {
    minWidth: 149,
  },
  tabContent: {
    position: "absolute",
    bottom: PLAYER_HEIGHT > MIN_PLAYER_HEIGHT ? PLAYER_HEIGHT : MIN_PLAYER_HEIGHT,
    top: 72,
    left: 0,
    right: 0,
    overflowY: "auto",
    padding: theme.spacing(1),
  },
  currentCallContainer: {
    position: "absolute",
    bottom: PLAYER_HEIGHT > MIN_PLAYER_HEIGHT ? PLAYER_HEIGHT : MIN_PLAYER_HEIGHT,
    left: 0,
    right: 0,
    height: CALL_SECTION_HEIGHT,
    backgroundColor: theme.palette.background.default, //"rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
    // backgroundColor: 'green',
    overflowY: "auto",
    padding: theme.spacing(1),
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  },
  smallPlayerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: PLAYER_HEIGHT,
    minHeight: MIN_PLAYER_HEIGHT,
    overflowY: "auto",
    padding: theme.spacing(1),
    // borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  }
}));

export default function (props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { setIsInConferenceRoom } = props;

  const userGroup = useSelector(getUserGroup, shallowEqual);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="standard"
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="Groups and Participants"
      >
        <Tab icon={<AvailableParticipantsIcon />} label="ATTENDEES" className={classes.tab} />
        <Tab icon={<ConversationsIcon />} label="CONVERSATIONS" className={classes.tab} />
      </Tabs>
      <div className={classes.tabContent}
      // style={{ bottom: userGroup ? CALL_SECTION_HEIGHT : 0 }}
      >
        {value === 0 && <AvailableTab setIsInConferenceRoom={setIsInConferenceRoom} />}
        {value === 1 && <ConversationsTab />}
      </div>
      {userGroup && (
        <div className={classes.currentCallContainer}>
          <CurrentCallActions />
        </div>
      )}
      {/* <div className={classes.currentCallContainer}>
        <CurrentCallActions />
      </div> */}
      <div className={classes.smallPlayerContainer}>
        <SmallPlayerContainer />
      </div>

    </div>
  );
}
