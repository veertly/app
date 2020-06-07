import React, { useMemo, useContext } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
// import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { makeStyles } from "@material-ui/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Divider,
  Box,
  Tooltip,
  // Hidden,
  // IconButton
} from "@material-ui/core";
// import MenuIcon from "@material-ui/icons/Menu";
import VeertlyLogo from "../../Assets/Veertly_white.svg";
// import AvatarLogin from "../Topbar/AvatarLogin";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import UserAvatar from "../Misc/UserAvatar";
import routes from "../../Config/routes";
// import DesktopMacIcon from "@material-ui/icons/DesktopMac";
// import ConversationsIcon from "../../Assets/Icons/Conversations";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getSessionId,
  getUser,
  getUserGroup,
  getEventSessionDetails,
  getFeatureDetails
} from "../../Redux/eventSession";
import { openEditProfile } from "../../Redux/dialogs";
// import { FEATURES } from "../../Modules/features";
import { logout } from "../../Redux/account";
import PresenceSwitch from "./PresenceSwitch";
import { trackEvent } from "../../Modules/analytics";
import { FEATURES } from "../../Modules/features";
import TechnicalCheckContext from "../../Containers/EventSession/TechnicalCheckContext";

// import routes from "../../Config/routes";
const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
    backgroundColor: theme.palette.topbar
      ? theme.palette.topbar.main
      : theme.palette.primary.main,
    color: theme.palette.getContrastText(
      theme.palette.topbar
        ? theme.palette.topbar.main
        : theme.palette.primary.main
    ),
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  },
  flexGrow: {
    flexGrow: 1,
    textAlign: "center"
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  logo: {
    // width: "100%",
    maxWidth: 150,
    // height: "100%",
    maxHeight: 42
    // marginTop: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(0, 2, 0, 1),
    float: "left",
    width: 135,
    textAlign: "center",
    whiteSpace: "nowrap"
  },

  title: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "block"
  },
  avatarContainer: {
    // position: "absolute",
    // right: theme.spacing(2)
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center"
  },
  presenceContainer: { marginRight: theme.spacing(3) },
  menuIcon: { color: "white" },
  iconButton: {
    color: "white",
  }
}));

// const RoomButton = ({ onClick, disabled, isCurrentRoom, children, icon }) => {
//   const classes = useStyles();
//   if (disabled) {
//     return (
//       <Button
//         className={classes.button}
//         variant="outlined"
//         color="secondary"
//         size="small"
//         disabled
//         onClick={() => onClick()}
//       >
//         {children}
//       </Button>
//     );
//   }
//   if (isCurrentRoom) {
//     return (
//       <div className={classes.currentRoomContainer}>
//         {icon}
//         <Typography variant="overline">{children}</Typography>
//       </div>
//     );
//   }
//   return (
//     <Button
//       className={classes.button}
//       variant="outlined"
//       color="secondary"
//       size="small"
//       onClick={() => onClick()}
//       startIcon={icon}
//     >
//       {children}
//     </Button>
//   );
// };

const EventSessionTopbar = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const user = useSelector(getUser, shallowEqual);
  const userGroup = useSelector(getUserGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const { muteVideo, muteAudio, setMuteAudio, setMuteVideo } = useContext(TechnicalCheckContext);

  const customThemeFeature = useSelector(
    getFeatureDetails(FEATURES.CUSTOM_THEME)
  );
  const isOwner = useMemo(() => user && user.id === eventSessionDetails.owner, [
    eventSessionDetails.owner,
    user
  ]);
  // const miniPlayerProperties = useSelector(
  //   getFeatureDetails(FEATURES.MINI_PLAYER),
  //   shallowEqual
  // );

  // const isMiniPlayerEnabled = React.useMemo(
  //   () =>
  //     miniPlayerProperties ? miniPlayerProperties.enabled === true : false,
  //   [miniPlayerProperties]
  // );

  // isInNetworkingCall,
  //   isNetworkingAvailable,
  function handleMenuClose() {
    setMenuAnchorEl(null);
  }

  function handleMenu(event) {
    setMenuAnchorEl(event.currentTarget);
  }

  const handleLogoutClick = () => {
    // logoutDb(sessionId, userGroup);
    dispatch(logout(sessionId, userGroup));
    handleMenuClose();
    if (sessionId) {
      history.push(routes.EVENT_SESSION(sessionId));
    }
  };

  const handleEditProfileClick = () => {
    dispatch(openEditProfile());
    handleMenuClose();
  };

  const handleEditEventClick = () => {
    trackEvent("Edit event clicked", { sessionId });
    window.open(routes.EDIT_EVENT_SESSION(sessionId), "_blank");
  };

  const handleCockpitClick = () => {
    trackEvent("Cockpit clicked", { sessionId });
    window.open("https://cockpit.veertly.com/event/" + sessionId, "_blank");
  };

  const handleVideoToggle = () => {
    setMuteVideo(!muteVideo);
  }

  const handleAudioToggle = () => {
    setMuteAudio(!muteAudio)
  }


  const logo = useMemo(() => {
    return customThemeFeature && customThemeFeature.logo
      ? customThemeFeature.logo
      : VeertlyLogo;
  }, [customThemeFeature]);

  return (
    <React.Fragment>
      <AppBar className={clsx(classes.root)}>
        <Toolbar style={{ position: "relative" }}>
          {/* <Hidden smUp>
            <IconButton className={classes.menuIcon}>
              <MenuIcon />
            </IconButton>
            <div className={classes.flexGrow}>
              <img alt="Logo" src={VeertlyLogo} className={classes.logo} />
            </div>
          </Hidden> */}

          {/* <Hidden smDown> */}
          <img alt="Logo" src={logo} className={classes.logo} />
          <div className={classes.flexGrow}></div>
          <div className={classes.titleContainer}>
            {!isMobile && eventSessionDetails && (
              <Typography
                variant="h5"
                align="center"
                style={{ fontWeight: "lighter" }}
                className={classes.title}
              >
                {eventSessionDetails.title}
              </Typography>
            )}
          </div>
          <div className={classes.presenceContainer}>
            <PresenceSwitch />
          </div>
          {/* </Hidden> */}

          {/* <Box paddingLeft={0} paddingRight={0}>
            <Tooltip title="Enter call with video On or Off">
              <IconButton aria-label="toggle video" color="secondary" onClick={handleVideoToggle}>
                {!muteVideo && <VideocamIcon />}
                {muteVideo && <VideocamOffIcon />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box paddingLeft={0} paddingRight={1}>
            <Tooltip title="Enter call with mic On or Off">
              <IconButton aria-label="toggle audio" color="secondary" onClick={handleAudioToggle}>
                {muteAudio && <MicOffIcon />}
                {!muteAudio && <MicIcon />}
              </IconButton>
            </Tooltip>
          </Box> */}

          <div className={classes.avatarContainer}>
            {/* <AvatarLogin eventSession={eventSession} /> */}
            <UserAvatar user={user} onClick={handleMenu} />
            <Menu
              id="menu-appbar"
              anchorEl={menuAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              keepMounted
              open={openMenu}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditProfileClick}>Edit profile</MenuItem>
              
              <MenuItem >
                <Tooltip title="Always enter call with video On or Off">
                  <Box width="100%" display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" onClick={handleVideoToggle}>
                      <Box marginRight={1}>
                        <Typography>
                          Toggle Video
                        </Typography>
                      </Box>
                      {!muteVideo && <VideocamIcon />}
                      {muteVideo && <VideocamOffIcon />}
                  </Box>
                </Tooltip>
              </MenuItem>
              
              <MenuItem onClick={handleAudioToggle}>
                <Tooltip title="Always enter call with mic On or Off">
                  <Box width="100%" display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Box marginRight={1}>
                      <Typography>
                        Toggle mic
                      </Typography>
                    </Box>
                    {muteAudio && <MicOffIcon />}
                    {!muteAudio && <MicIcon />}
                  </Box>
                </Tooltip>
              </MenuItem>

              {isOwner && <Divider />}
              {isOwner && (
                <MenuItem onClick={handleEditEventClick}>Edit event</MenuItem>
              )}
              {isOwner && (
                <MenuItem onClick={handleCockpitClick}>Cockpit</MenuItem>
              )}
              {isOwner && <Divider />}
              {/* <MenuItem onClick={handleLeaveEventClick}>Leave event</MenuItem> */}
              <MenuItem onClick={handleLogoutClick}>Log out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default EventSessionTopbar;
