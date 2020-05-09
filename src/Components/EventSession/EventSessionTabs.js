import React, { useContext } from "react";
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
import Typography from "@material-ui/core/Typography";
import JitsiContext from "../../Containers/EventSession/JitsiContext";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { Tooltip } from "@material-ui/core";
import { trackEvent } from "../../Modules/analytics";

const CALL_SECTION_HEIGHT = 110;

// const PLAYER_HEIGHT = Math.floor(0.32 * window.innerHeight);
// const MIN_PLAYER_HEIGHT = 200;
const TOOLBAR_HEIGHT = 32;
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 300,
    position: "relative",
  },
  tab: {
    minWidth: 149,
  },
  tabContent: (props) => ({
    position: "absolute",
    bottom:
      (props.showSmallPlayer ? 0 : TOOLBAR_HEIGHT) +
      (props.showCallContainer ? CALL_SECTION_HEIGHT : 0),
    top: 72,
    left: 0,
    right: 0,
    overflowY: "auto",
    padding: theme.spacing(1),
  }),
  currentCallContainer: (props) => ({
    position: "absolute",
    bottom: props.showSmallPlayer ? 0 : TOOLBAR_HEIGHT,
    left: 0,
    right: 0,
    height: CALL_SECTION_HEIGHT,
    backgroundColor: theme.palette.background.default,
    overflowY: "auto",
    padding: theme.spacing(1),
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  }),
  smallPlayerContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    height: TOOLBAR_HEIGHT,
    overflowY: "auto",
    padding: theme.spacing(1),
  },
  toolbar: {
    width: "100%",
    flex: 1,
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: "#486981",
    color: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.4),
    paddingBottom: theme.spacing(0.4),
  },
  playerOuterContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
  },
  openInNewContainer: {
    flex: 0.5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    "& > * + *": {
      marginLeft: theme.spacing(0.8),
    },
  },
  icon: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const ToolbarClosed = ({ setShowSmallPlayer }) => {
  const classes = useStyles();
  return (
    <div className={classes.playerOuterContainer}>
      <div className={classes.toolbar}>
        <div className={classes.toolbarTitle}>
          <Typography variant="subtitle1">Main Stage</Typography>
        </div>
        <div className={classes.openInNewContainer}>
          <Tooltip title="Open main stage">
            <OpenInNewIcon
              className={classes.icon}
              onClick={() => {
                setShowSmallPlayer(true);
                trackEvent("Mini player opened", {});
              }}
            />
          </Tooltip>
          {/* <VolumeDownIcon className={classes.icon} />
              <Slider className={classes.slider} value={volume} onChange={handleVolumeChange} aria-labelledby="continuous-slider" />
            <VolumeUpIcon className={classes.icon} />
            <CloseIcon className={classes.icon} onClick={() => setClosePlayer(true)}></CloseIcon> */}
        </div>
      </div>
    </div>
  );
};

export default function (props) {
  const { showSmallPlayer, setShowSmallPlayer } = useContext(JitsiContext);
  const [value, setValue] = React.useState(0);
  const { setIsInConferenceRoom } = props;

  const userGroup = useSelector(getUserGroup, shallowEqual);
  const classes = useStyles({
    showSmallPlayer,
    showCallContainer: !!userGroup,
  });

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
        <Tab
          icon={<AvailableParticipantsIcon />}
          label="ATTENDEES"
          className={classes.tab}
        />
        <Tab
          icon={<ConversationsIcon />}
          label="DISCUSSIONS"
          className={classes.tab}
        />
      </Tabs>
      <div
        className={classes.tabContent}
        // style={{ bottom: userGroup ? CALL_SECTION_HEIGHT : 0 }}
      >
        {value === 0 && (
          <AvailableTab setIsInConferenceRoom={setIsInConferenceRoom} />
        )}
        {value === 1 && <ConversationsTab />}
      </div>
      {userGroup && (
        <div className={classes.currentCallContainer}>
          <CurrentCallActions />
        </div>
      )}
      {!showSmallPlayer && (
        <div className={classes.smallPlayerContainer}>
          <ToolbarClosed setShowSmallPlayer={setShowSmallPlayer} />
        </div>
      )}
    </div>
  );
}
