import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AvailableParticipantsIcon from "../../Assets/Icons/AvailableParticipants";
import ConversationsIcon from "../../Assets/Icons/Conversations";
import ConversationsTab from "./ConversationsTab";
import AvailableTab from "./AvailableTab";
import CurrentCallActions from "./CurrentCallActions";

const CALL_SECTION_HEIGHT = 110;

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
    bottom: 0,
    top: 72,
    left: 0,
    right: 0,
    overflowY: "auto",
    padding: theme.spacing(1),
  },
  currentCallContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: CALL_SECTION_HEIGHT,
    backgroundColor: theme.palette.background.default, //"rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
    overflowY: "auto",
    padding: theme.spacing(1),
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  },
}));

export default function (props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { users, eventSession, currentGroup, user } = props;

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
      <div className={classes.tabContent} style={{ bottom: currentGroup ? CALL_SECTION_HEIGHT : 0 }}>
        {value === 0 && <AvailableTab users={users} eventSession={eventSession} user={user} />}
        {value === 1 && <ConversationsTab users={users} eventSession={eventSession} user={user} />}
      </div>
      {currentGroup && (
        <div className={classes.currentCallContainer}>
          <CurrentCallActions currentGroup={currentGroup} users={users} user={user} eventSession={eventSession} />
        </div>
      )}
    </div>
  );
}
