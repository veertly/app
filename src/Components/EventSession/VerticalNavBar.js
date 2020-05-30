import React from "react";
import { makeStyles /*, useTheme */ } from "@material-ui/core/styles";

// import LobbyIcon from "@material-ui/icons/Store";
// import LobbyIcon from "@material-ui/icons/Deck";
// import LobbyIcon from "@material-ui/icons/EventSeat";

import LobbyIcon from "@material-ui/icons/Weekend";

import MainStageIcon from "@material-ui/icons/DesktopMac";
import RoomsIcon from "../../Assets/Icons/Rooms";

import AttendeesIcon from "../../Assets/Icons/Person";
// import ConversationsIcon from "../../../Assets/Icons/Conversations";
import NetworkingIcon from "../../Assets/Icons/Conversation1-1";
import ChatIcon from "../../Assets/Icons/Chat";
import PollsIcon from "../../Assets/Icons/Polls";
import QnAIcon from "../../Assets/Icons/QnA";
import HelpIcon from "../../Assets/Icons/Help";

import { useHover } from "react-use";
import { leaveCall } from "../../Modules/eventSessionOperations";

// import { useDispatch, useSelector, shallowEqual } from "react-redux";
// import {
//   openEditProfile,
//   openEventDetails,
//   openChat,
//   closeChat,
//   openShare,
//   openFeedback,
//   isChatOpen
// } from "../../../Redux/dialogs";
// import routes from "../../../Config/routes";
// import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { setUserCurrentLocation } from "../../Modules/userOperations";
// import { useHistory } from "react-router-dom";
// import FeedbackIcon from "@material-ui/icons/GraphicEq";
// import {
//   getSessionId,
//   getEventSessionDetails,
//   getUserId
// } from "../../../Redux/eventSession";
// import {
//   hideNotificationDot,
//   toShowNotificationDot
// } from "../../../Redux/chatMessages";
// import Badge from "@material-ui/core/Badge";
// import { trackEvent } from "../../../Modules/analytics";
import { Box, Typography, Divider, Badge } from "@material-ui/core";
import VerticalNavBarContext, {
  VERTICAL_NAV_OPTIONS
} from "../../Contexts/VerticalNavBarContext";
import { useSelector, shallowEqual } from "react-redux";
import {
  getUserCurrentLocation,
  getSessionId,
  getUserGroup,
  getUserId
} from "../../Redux/eventSession";
import { toShowNotificationDot } from "../../Redux/chatMessages";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
    // paddingTop: theme.spacing(2)
  },
  menuItem: ({ selected, hovered, isCurrentLocation }) => ({
    padding: theme.spacing(1, 0, 1, 0),
    // borderTop: selected ? `1px solid ${theme.palette.secondary.light}` : "none",
    // borderBottom: selected
    //   ? `1px solid ${theme.palette.secondary.light}`
    //   : "none",

    borderLeft: `4px solid ${
      isCurrentLocation
        ? theme.palette.secondary.light
        : selected
        ? theme.palette.primary.main
        : hovered
        ? theme.palette.background.default
        : "#fff"
    }`,
    backgroundColor: selected ? theme.palette.background.default : "inherit",
    "&:hover": {
      backgroundColor: theme.palette.background.default, //"rgba(0, 0, 0, 0.04)",
      // backgroundColor: theme.palette.secondary.light, //"rgba(0, 0, 0, 0.04)",
      cursor: "pointer"
    }
  }),
  itemInnerBox: ({ selected }) => ({}),
  itemIconBox: {
    // marginBottom: theme.spacing(0.5)
  },
  itemIcon: ({ selected, hovered, isCurrentLocation }) => ({
    width: "100%",
    height: "100%",
    maxWidth: 32,
    maxHeight: 32,
    color: isCurrentLocation
      ? theme.palette.secondary.light
      : hovered || selected
      ? theme.palette.primary.main
      : theme.palette.primary.light

    // color: theme.palette.text.secondary
  })
}));

const MenuIconContainer = ({
  icon,
  label,
  selected,
  isCurrentLocation,
  hasBadge = false,
  ...rest
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const classes = useStyles({
    selected,
    hovered: isHovered,
    isCurrentLocation
  });

  const item = (hovered) => (
    <Box align="center" className={classes.menuItem} {...rest}>
      <Box className={classes.itemInnerBox}>
        <Box className={classes.itemIconBox}>
          <Badge color="secondary" variant="dot" invisible={!hasBadge}>
            <Icon className={classes.itemIcon} />
          </Badge>
        </Box>
        <Box className={classes.itemLabel}>
          <Typography variant="caption" color="textSecondary">
            {label}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
  const Icon = icon;

  const [hoverable, hovered] = useHover(item);

  React.useEffect(() => {
    if (isHovered !== hovered) {
      setIsHovered(hovered);
    }
  }, [hovered, isHovered]);

  return hoverable;
};

const VerticalNavBar = (props) => {
  // const { eventSession, user } = props;
  const classes = useStyles();

  const {
    currentNavBarSelection,
    setCurrentNavBarSelection,
    setHasNavBarPaneOpen
  } = React.useContext(VerticalNavBarContext);

  const userCurrentLocation = useSelector(getUserCurrentLocation, shallowEqual);
  const [currentLocation, setCurrentLocation] = React.useState(
    userCurrentLocation
  );
  const sessionId = useSelector(getSessionId);
  const userGroup = useSelector(getUserGroup);
  const userId = useSelector(getUserId);

  const showNotificationDot = useSelector(toShowNotificationDot);

  React.useEffect(() => {
    setCurrentLocation(userCurrentLocation);
    setCurrentNavBarSelection(userCurrentLocation);

    if (
      userCurrentLocation === VERTICAL_NAV_OPTIONS.lobby ||
      userCurrentLocation === VERTICAL_NAV_OPTIONS.mainStage
    ) {
      // setHasNavBarPaneOpen(false);
      if (userGroup) {
        //TODO: show warning dialog
        leaveCall(sessionId, userGroup, userId);
      }
    }
    if (userCurrentLocation === VERTICAL_NAV_OPTIONS.lobby) {
      setHasNavBarPaneOpen(false);
    } else {
      setHasNavBarPaneOpen(true);
    }
  }, [
    sessionId,
    setCurrentNavBarSelection,
    setHasNavBarPaneOpen,
    userCurrentLocation,
    userGroup,
    userId
  ]);

  const handleClick = (location) => (e) => {
    if (currentNavBarSelection !== location) {
      if (
        userCurrentLocation === VERTICAL_NAV_OPTIONS.lobby &&
        location === VERTICAL_NAV_OPTIONS.lobby
      ) {
        setHasNavBarPaneOpen(false);
      } else {
        setHasNavBarPaneOpen(true);
      }
      setCurrentNavBarSelection(location);

      if (
        userCurrentLocation === VERTICAL_NAV_OPTIONS.lobby &&
        location === VERTICAL_NAV_OPTIONS.mainStage
      ) {
        setUserCurrentLocation(sessionId, VERTICAL_NAV_OPTIONS.mainStage);
      }

      // }
    } else {
      if (location !== VERTICAL_NAV_OPTIONS.lobby) {
        setCurrentNavBarSelection(null);
        setHasNavBarPaneOpen(false);
      }
    }
  };

  return (
    <div className={classes.root}>
      <MenuIconContainer
        icon={LobbyIcon}
        label="Lobby"
        selected={currentNavBarSelection === VERTICAL_NAV_OPTIONS.lobby}
        onClick={handleClick(VERTICAL_NAV_OPTIONS.lobby)}
        isCurrentLocation={currentLocation === VERTICAL_NAV_OPTIONS.lobby}
      />
      <MenuIconContainer
        icon={MainStageIcon}
        label="Main Stage"
        selected={currentNavBarSelection === VERTICAL_NAV_OPTIONS.mainStage}
        onClick={handleClick(VERTICAL_NAV_OPTIONS.mainStage)}
        isCurrentLocation={currentLocation === VERTICAL_NAV_OPTIONS.mainStage}
      />
      <MenuIconContainer
        icon={RoomsIcon}
        label="Rooms"
        selected={currentNavBarSelection === VERTICAL_NAV_OPTIONS.rooms}
        onClick={handleClick(VERTICAL_NAV_OPTIONS.rooms)}
        isCurrentLocation={currentLocation === VERTICAL_NAV_OPTIONS.rooms}
      />
      <MenuIconContainer
        icon={NetworkingIcon}
        label="Networking"
        selected={currentNavBarSelection === VERTICAL_NAV_OPTIONS.networking}
        onClick={handleClick(VERTICAL_NAV_OPTIONS.networking)}
        isCurrentLocation={currentLocation === VERTICAL_NAV_OPTIONS.networking}
      />
      <MenuIconContainer
        icon={AttendeesIcon}
        label="Attendees"
        selected={currentNavBarSelection === VERTICAL_NAV_OPTIONS.attendees}
        onClick={handleClick(VERTICAL_NAV_OPTIONS.attendees)}
      />
      <Divider />
      {/* <MenuIconContainer icon={ConversationsIcon} label="Conversations" /> */}
      <MenuIconContainer
        icon={ChatIcon}
        label="Chat"
        selected={currentNavBarSelection === VERTICAL_NAV_OPTIONS.chat}
        onClick={handleClick(VERTICAL_NAV_OPTIONS.chat)}
        hasBadge={showNotificationDot}
      />

      <MenuIconContainer
        icon={QnAIcon}
        label="Q&amp;A"
        selected={currentNavBarSelection === VERTICAL_NAV_OPTIONS.qna}
        onClick={handleClick(VERTICAL_NAV_OPTIONS.qna)}
      />
      <MenuIconContainer
        icon={PollsIcon}
        label="Polls"
        selected={currentNavBarSelection === VERTICAL_NAV_OPTIONS.polls}
        onClick={handleClick(VERTICAL_NAV_OPTIONS.polls)}
      />
      <div style={{ flexGrow: 1 }}></div>
      <MenuIconContainer
        icon={HelpIcon}
        label="Help"
        selected={currentNavBarSelection === VERTICAL_NAV_OPTIONS.help}
        onClick={handleClick(VERTICAL_NAV_OPTIONS.help)}
      />
    </div>
  );
};

export default VerticalNavBar;
