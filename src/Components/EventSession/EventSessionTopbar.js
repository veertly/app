import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import clsx from "clsx";
// import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { makeStyles } from "@material-ui/styles";
import {
  AppBar,
  Toolbar,
  Typography
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
  getEventSessionDetails
  // getFeatureDetails
} from "../../Redux/eventSession";
import { openEditProfile } from "../../Redux/dialogs";
// import { FEATURES } from "../../Modules/features";
import { logout } from "../../Redux/account";
import PresenceSwitch from "./PresenceSwitch";

// import routes from "../../Config/routes";
const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none"
  },
  flexGrow: {
    flexGrow: 1,
    textAlign: "center"
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  logo: {
    width: 150
    // marginTop: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(0, 2, 0, 1),
    float: "left",
    width: 135,
    textAlign: "center",
    whiteSpace: "nowrap"
  },
  roomButtonsContainer: {
    margin: theme.spacing(0, 4, 0, 4),
    minWidth: 318
  },
  currentRoomContainer: {
    backgroundColor: theme.palette.secondary.main,
    height: 29,
    // padding: 8
    color: theme.palette.text.primary,
    float: "left",
    margin: theme.spacing(0, 2, 0, 1),
    padding: theme.spacing(0, 1),
    border: "1px solid " + theme.palette.secondary.main,
    boxShadow:
      "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)",
    width: 135,
    textAlign: "center"
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
  menuIcon: { color: "white" }
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

export default withRouter((props) => {
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
          <img alt="Logo" src={VeertlyLogo} className={classes.logo} />
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
              {/* <MenuItem onClick={handleLeaveEventClick}>Leave event</MenuItem> */}
              <MenuItem onClick={handleLogoutClick}>Log out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
});
