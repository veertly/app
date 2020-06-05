import React, { useEffect, useMemo } from "react";
import { makeStyles /*, useTheme */ } from "@material-ui/core/styles";

// import LobbyIcon from "@material-ui/icons/Store";
// import LobbyIcon from "@material-ui/icons/Deck";
// import LobbyIcon from "@material-ui/icons/EventSeat";

import { useLocalStorage } from "react-use";

import _ from "lodash";

import LobbyIcon from "@material-ui/icons/Weekend";
import MainStageIcon from "@material-ui/icons/DesktopMac";
import RoomsIcon from "../../Assets/Icons/Rooms";
import AttendeesIcon from "../../Assets/Icons/Person";
import NetworkingIcon from "../../Assets/Icons/Conversation1-1";
import ChatIcon from "../../Assets/Icons/Chat";
import PollsIcon from "../../Assets/Icons/Polls";
import QnAIcon from "../../Assets/Icons/QnA";
import HelpIcon from "../../Assets/Icons/Help";

import { useHover } from "react-use";
import { leaveCall } from "../../Modules/eventSessionOperations";
import { setUserCurrentLocation } from "../../Modules/userOperations";
import { Box, Typography, Divider, Badge } from "@material-ui/core";
import VerticalNavBarContext, {
  VERTICAL_NAV_OPTIONS
} from "../../Contexts/VerticalNavBarContext";
import { useSelector, shallowEqual } from "react-redux";
import {
  getUserCurrentLocation,
  getSessionId,
  getUserGroup,
  getUserId,
  getFeatureDetails
} from "../../Redux/eventSession";
import ChatMessagesContext, {
  CHAT_GLOBAL_NS
} from "../../Contexts/ChatMessagesContext";
import { FEATURES } from "../../Modules/features";

export const DEAFULT_NAV_BAR = {
  [VERTICAL_NAV_OPTIONS.lobby]: {
    id: VERTICAL_NAV_OPTIONS.lobby,
    label: "Lobby",
    icon: LobbyIcon,
    order: 1,
    visible: true
  },
  [VERTICAL_NAV_OPTIONS.mainStage]: {
    id: VERTICAL_NAV_OPTIONS.mainStage,
    label: "Main Stage",
    icon: MainStageIcon,
    order: 2,
    visible: true
  },
  [VERTICAL_NAV_OPTIONS.rooms]: {
    id: VERTICAL_NAV_OPTIONS.rooms,
    label: "Rooms",
    icon: RoomsIcon,
    order: 3,
    visible: true
  },
  [VERTICAL_NAV_OPTIONS.networking]: {
    id: VERTICAL_NAV_OPTIONS.networking,
    label: "Networking",
    icon: NetworkingIcon,
    order: 4,
    visible: true
  },
  [VERTICAL_NAV_OPTIONS.attendees]: {
    id: VERTICAL_NAV_OPTIONS.attendees,
    label: "Attendees",
    icon: AttendeesIcon,
    order: 5,
    visible: true
  },
  divider: {
    id: "divider",
    label: "",
    icon: null,
    order: 6,
    visible: true
  },
  [VERTICAL_NAV_OPTIONS.chat]: {
    id: VERTICAL_NAV_OPTIONS.chat,
    label: "Chat",
    icon: ChatIcon,
    order: 7,
    visible: true
  },
  [VERTICAL_NAV_OPTIONS.qna]: {
    id: VERTICAL_NAV_OPTIONS.qna,
    label: "Q&A",
    icon: QnAIcon,
    order: 8,
    visible: false
  },
  [VERTICAL_NAV_OPTIONS.polls]: {
    id: VERTICAL_NAV_OPTIONS.polls,
    label: "Polls",
    icon: PollsIcon,
    order: 9,
    visible: true
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  menuItem: ({ selected, hovered, isCurrentLocation }) => ({
    padding: theme.spacing(1, 0, 1, 0),
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
      cursor: "pointer"
    }
  }),
  itemInnerBox: ({ selected }) => ({}),
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

  const Icon = icon;

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

  const [hoverable, hovered] = useHover(item);

  React.useEffect(() => {
    if (isHovered !== hovered) {
      setIsHovered(hovered);
    }
  }, [hovered, isHovered]);

  return hoverable;
};

const VerticalNavBar = (props) => {
  const classes = useStyles();

  const {
    currentNavBarSelection,
    setCurrentNavBarSelection,
    setHasNavBarPaneOpen
  } = React.useContext(VerticalNavBarContext);

  const sessionId = useSelector(getSessionId);
  const userGroup = useSelector(getUserGroup);
  const userId = useSelector(getUserId);

  const [lastNavBarSelection, setLastNavBarSelection] = React.useState(null);

  const userCurrentLocation = useSelector(getUserCurrentLocation, shallowEqual);

  const [currentLocation, setCurrentLocation] = React.useState(
    userCurrentLocation
  );
  const [lastCurrentSelection, setLastCurrentSelection] = React.useState(null);

  const [lastGlobalChatOpenCount, setLastGlobalChatOpenCount] = useLocalStorage(
    `veertly/chat/${CHAT_GLOBAL_NS}/${sessionId}/${userId}/count`,
    0,
    {
      raw: true
    }
  );

  const [hasChatBadge, setHasChatBadge] = React.useState(false);

  const { chatMessages } = React.useContext(ChatMessagesContext);

  const customNavBarFeature = useSelector(
    getFeatureDetails(FEATURES.CUSTOM_NAV_BAR),
    shallowEqual
  );
  const navBarOptions = useMemo(() => {
    if (!customNavBarFeature) {
      return Object.values(DEAFULT_NAV_BAR);
    }

    let result = { ...DEAFULT_NAV_BAR };

    _.forEach(Object.values(customNavBarFeature), ({ id, label, visible }) => {
      if (result[id]) {
        result[id].label = label;
        result[id].visible = visible !== false;
      }
    });

    return Object.values(result);
  }, [customNavBarFeature]);

  useEffect(() => {
    if (currentNavBarSelection !== lastNavBarSelection) {
      if (
        lastNavBarSelection === VERTICAL_NAV_OPTIONS.chat &&
        currentNavBarSelection !== VERTICAL_NAV_OPTIONS.chat
      ) {
        // chat closed
        setLastGlobalChatOpenCount(chatMessages[CHAT_GLOBAL_NS].length);
      } else if (
        lastNavBarSelection !== VERTICAL_NAV_OPTIONS.chat &&
        currentNavBarSelection === VERTICAL_NAV_OPTIONS.chat
      ) {
        // chat opened
        setLastGlobalChatOpenCount(chatMessages[CHAT_GLOBAL_NS].length);
        setHasChatBadge(false);
      }

      setLastNavBarSelection(currentNavBarSelection);
    }
  }, [
    chatMessages,
    currentNavBarSelection,
    lastNavBarSelection,
    setLastGlobalChatOpenCount
  ]);

  useEffect(() => {
    if (chatMessages[CHAT_GLOBAL_NS].length > lastGlobalChatOpenCount) {
      // new msg
      if (
        currentNavBarSelection !== VERTICAL_NAV_OPTIONS.chat && // not on chat
        lastNavBarSelection !== VERTICAL_NAV_OPTIONS.chat // not previously on chat
      ) {
        setHasChatBadge(true);
      }
      if (currentNavBarSelection === VERTICAL_NAV_OPTIONS.chat) {
        setLastGlobalChatOpenCount(chatMessages[CHAT_GLOBAL_NS].length);
      }
    }
  }, [
    chatMessages,
    currentNavBarSelection,
    lastGlobalChatOpenCount,
    lastNavBarSelection,
    setLastGlobalChatOpenCount
  ]);

  useEffect(() => {
    if (userCurrentLocation !== lastCurrentSelection) {
      setCurrentLocation(userCurrentLocation);
      setCurrentNavBarSelection(userCurrentLocation);

      if (
        userCurrentLocation === VERTICAL_NAV_OPTIONS.lobby ||
        userCurrentLocation === VERTICAL_NAV_OPTIONS.mainStage
      ) {
        if (userGroup) {
          leaveCall(sessionId, userGroup, userId);
        }
      }
      if (userCurrentLocation === VERTICAL_NAV_OPTIONS.lobby) {
        setHasNavBarPaneOpen(false);
      } else {
        setHasNavBarPaneOpen(true);
      }
      setLastCurrentSelection(userCurrentLocation);
    }
  }, [
    lastCurrentSelection,
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
      // if (location !== VERTICAL_NAV_OPTIONS.lobby) {
      setCurrentNavBarSelection(null);
      setHasNavBarPaneOpen(false);
      // }
    }
  };

  return (
    <div className={classes.root}>
      {navBarOptions.map(({ icon, label, id, visible }) => {
        if (id === "divider" && visible) {
          return <Divider key="divider" />;
        } else if (visible) {
          return (
            <MenuIconContainer
              key={id}
              icon={icon}
              label={label}
              selected={currentNavBarSelection === id}
              onClick={handleClick(id)}
              isCurrentLocation={currentLocation === id}
              hasBadge={id === VERTICAL_NAV_OPTIONS.chat ? hasChatBadge : false}
            />
          );
        }
        return null;
      })}

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
