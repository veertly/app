import React from "react";
import { makeStyles /*, useTheme */ } from "@material-ui/core/styles";

// import LobbyIcon from "@material-ui/icons/Store";
// import LobbyIcon from "@material-ui/icons/Deck";
// import LobbyIcon from "@material-ui/icons/EventSeat";

import LobbyIcon from "@material-ui/icons/Weekend";

import MainStageIcon from "@material-ui/icons/DesktopMac";
import RoomsIcon from "../../../Assets/Icons/Rooms";

import AttendeesIcon from "../../../Assets/Icons/Person";
// import ConversationsIcon from "../../../Assets/Icons/Conversations";
// import ConversationsIcon from "../../../Assets/Icons/Conversation1-1";
import ChatIcon from "../../../Assets/Icons/Chat";

import { useHover } from "react-use";

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
// import { logout } from "../../Modules/userOperations";
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
import { Box, Typography } from "@material-ui/core";

// import { Badge } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
    // paddingTop: theme.spacing(2)
  },
  menuItem: ({ selected, hovered }) => ({
    padding: theme.spacing(2, 0, 2, 0),
    // borderTop: selected ? `1px solid ${theme.palette.secondary.light}` : "none",
    // borderBottom: selected
    //   ? `1px solid ${theme.palette.secondary.light}`
    //   : "none",

    borderLeft: `4px solid ${
      selected
        ? theme.palette.secondary.light
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
  itemIcon: ({ selected, hovered }) => ({
    width: "100%",
    height: "100%",
    maxWidth: 32,
    maxHeight: 32,
    color:
      hovered || selected
        ? theme.palette.primary.main
        : theme.palette.primary.light

    // color: theme.palette.text.secondary
  })
}));

const STAGES_OPTIONS = {
  lobby: "LOBBY",
  mainStage: "MAIN_STAGE",
  rooms: "ROOMS",
  attendees: "ATTENDEES",
  chat: "CHAT"
};

const MenuIconContainer = ({ icon, label, selected, ...rest }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const classes = useStyles({ selected, hovered: isHovered });

  const item = (hovered) => (
    <Box align="center" className={classes.menuItem} {...rest}>
      <Box className={classes.itemInnerBox}>
        <Box className={classes.itemIconBox}>
          <Icon className={classes.itemIcon} />
          {/* {icon} */}
        </Box>
        <Box className={classes.itemLabel}>
          <Typography variant="caption">{label}</Typography>
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

  const [currentStage, setCurrentStage] = React.useState(STAGES_OPTIONS.lobby);
  // const dispatch = useDispatch();
  // const chatOpen = useSelector(isChatOpen);

  // const sessionId = useSelector(getSessionId);
  // const userId = useSelector(getUserId);
  // const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  // const isOwner = React.useMemo(
  //   () => eventSessionDetails && eventSessionDetails.owner === userId,
  //   [eventSessionDetails, userId]
  // );
  // const showNotificationDot = useSelector(toShowNotificationDot);

  // const toggleChatPane = React.useCallback(() => {
  //   if (chatOpen) {
  //     trackEvent("SideMenu: Chat closed clicked", { sessionId });
  //     dispatch(closeChat());
  //   } else {
  //     dispatch(hideNotificationDot());
  //     dispatch(openChat());
  //     trackEvent("SideMenu: Chat opened clicked", { sessionId });
  //   }
  // }, [dispatch, chatOpen, sessionId]);
  const handleClick = (stage) => (e) => {
    if (currentStage !== stage) {
      setCurrentStage(stage);
    }
  };

  return (
    <div className={classes.root}>
      <MenuIconContainer
        icon={LobbyIcon}
        label="Lobby"
        selected={currentStage === STAGES_OPTIONS.lobby}
        onClick={handleClick(STAGES_OPTIONS.lobby)}
      />
      <MenuIconContainer
        icon={MainStageIcon}
        label="Main Stage"
        selected={currentStage === STAGES_OPTIONS.mainStage}
        onClick={handleClick(STAGES_OPTIONS.mainStage)}
      />
      <MenuIconContainer
        icon={RoomsIcon}
        label="Rooms"
        selected={currentStage === STAGES_OPTIONS.rooms}
        onClick={handleClick(STAGES_OPTIONS.rooms)}
      />
      <MenuIconContainer
        icon={AttendeesIcon}
        label="Attendees"
        selected={currentStage === STAGES_OPTIONS.attendees}
        onClick={handleClick(STAGES_OPTIONS.attendees)}
      />
      {/* <Divider /> */}
      {/* <MenuIconContainer icon={ConversationsIcon} label="Conversations" /> */}
      <MenuIconContainer
        icon={ChatIcon}
        label="Chat"
        selected={currentStage === STAGES_OPTIONS.chat}
        onClick={handleClick(STAGES_OPTIONS.chat)}
      />
      <div style={{ flexGrow: 1 }}></div>
      {/* <MenuIconContainer icon={ChatIcon} label="Chat" /> */}

      {/* <List>
        <Tooltip title="Exit Event">
          <ListItem
            button
            onClick={() => {
              logout();
              history.push(routes.EVENT_SESSION(sessionId));
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon color="primary" />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
      </List> */}
    </div>
  );
};

export default VerticalNavBar;
