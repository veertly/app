import React, { useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

import VeertlyLogo from "../../Assets/VeertlyBeta_white.svg";

// import AvatarLogin from "../Topbar/AvatarLogin";
import GoToNetworkingRoomDialog from "./GoToNetworkingRoomDialog";
import GoToConferenceRoomDialog from "./GoToConferenceRoomDialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import UserAvatar from "../Misc/UserAvatar";
import { logout } from "../../Modules/userOperations";
import routes from "../../Config/routes";
// import DesktopMacIcon from "@material-ui/icons/DesktopMac";
// import ConversationsIcon from "../../Assets/Icons/Conversations";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getSessionId, getUser, getUserGroup, getEventSessionDetails } from "../../Redux/eventSession";
import { openEditProfile } from "../../Redux/dialogs";

// import routes from "../../Config/routes";
const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
  },
  flexGrow: {
    flexGrow: 1,
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
  },
  logo: {
    width: 180,
    // marginTop: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(0, 2, 0, 1),
    float: "left",
    width: 135,
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  roomButtonsContainer: {
    margin: theme.spacing(0, 4, 0, 4),
    minWidth: 318,
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
    boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)",
    width: 135,
    textAlign: "center",
  },
  title: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "block",
  },
  avatarContainer: {
    position: "absolute",
    right: theme.spacing(2),
  },
}));

const RoomButton = ({ onClick, disabled, isCurrentRoom, children, icon }) => {
  const classes = useStyles();
  if (disabled) {
    return (
      <Button
        className={classes.button}
        variant="outlined"
        color="secondary"
        size="small"
        disabled
        onClick={() => onClick()}
      >
        {children}
      </Button>
    );
  }
  if (isCurrentRoom) {
    return (
      <div className={classes.currentRoomContainer}>
        {icon}
        <Typography variant="overline">{children}</Typography>
      </div>
    );
  }
  return (
    <Button
      className={classes.button}
      variant="outlined"
      color="secondary"
      size="small"
      onClick={() => onClick()}
      startIcon={icon}
    >
      {children}
    </Button>
  );
};

export default withRouter((props) => {
  const { isInConferenceRoom, setIsInConferenceRoom } = props;
  let [goToNetworkingDialog, setGoToNetworkingDialog] = useState(false);
  let [goToConferenceDialog, setGoToConferenceDialog] = useState(false);
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

  // isInNetworkingCall,
  //   isNetworkingAvailable,
  function handleMenuClose() {
    setMenuAnchorEl(null);
  }

  function handleMenu(event) {
    setMenuAnchorEl(event.currentTarget);
  }

  const handleLogoutClick = () => {
    logout(sessionId);
    handleMenuClose();
    if (sessionId) {
      history.push(routes.EVENT_SESSION(sessionId));
    }
  };

  const handleConferenceRoomClick = () => {
    if (userGroup) {
      setGoToConferenceDialog(true);
    } else {
      setIsInConferenceRoom(true);
    }
  };

  const handleNetworkingRoomClick = () => {
    setGoToNetworkingDialog(true);
  };

  const handleEditProfileClick = () => {
    dispatch(openEditProfile());
  };

  return (
    <React.Fragment>
      <AppBar className={clsx(classes.root)}>
        <Toolbar style={{ position: "relative" }}>
          <img alt="Logo" src={VeertlyLogo} className={classes.logo} />
          {!isMobile && eventSessionDetails && (
            <div className={classes.roomButtonsContainer}>
              <RoomButton
                isCurrentRoom={isInConferenceRoom}
                onClick={handleConferenceRoomClick}
                // icon={<DesktopMacIcon />}
              >
                Main Stage
              </RoomButton>
              <RoomButton
                isCurrentRoom={!isInConferenceRoom}
                onClick={handleNetworkingRoomClick}
                disabled={!eventSessionDetails.isNetworkingAvailable}
                // icon={<ConversationsIcon />}
              >
                Networking Area
              </RoomButton>
            </div>
          )}
          {/* </RouterLink> */}
          <div className={classes.flexGrow}>
            {!isMobile && eventSessionDetails && (
              // <div className={classes.title}>
              <Typography variant="h5" align="left" style={{ fontWeight: "lighter" }} className={classes.title}>
                {eventSessionDetails.title}
              </Typography>
            )}
          </div>
          <div className={classes.avatarContainer}>
            {/* <AvatarLogin eventSession={eventSession} /> */}
            <UserAvatar user={user} onClick={handleMenu} />
            <Menu
              id="menu-appbar"
              anchorEl={menuAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              open={openMenu}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditProfileClick}>Edit profile</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Log out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <GoToNetworkingRoomDialog
        open={goToNetworkingDialog}
        setOpen={setGoToNetworkingDialog}
        handleLeaveCall={() => {
          setIsInConferenceRoom(false);
          setGoToNetworkingDialog(false);
        }}
      />
      <GoToConferenceRoomDialog
        open={goToConferenceDialog}
        setOpen={setGoToConferenceDialog}
        handleLeaveCall={() => {
          setIsInConferenceRoom(true);
          setGoToConferenceDialog(false);
        }}
      />
    </React.Fragment>
  );
});
