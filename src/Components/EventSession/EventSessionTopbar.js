import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import clsx from "clsx";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

import VeertlyLogo from "../../Assets/Veertly_white.svg";

// import AvatarLogin from "../Topbar/AvatarLogin";
import GoToNetworkingRoomDialog from "./GoToNetworkingRoomDialog";
import GoToConferenceRoomDialog from "./GoToConferenceRoomDialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import UserAvatar from "../Misc/UserAvatar";

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

const RoomButton = ({ onClick, disabled, isCurrentRoom, children }) => {
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
        <Typography variant="overline">{children}</Typography>
      </div>
    );
  }
  return (
    <Button className={classes.button} variant="outlined" color="secondary" size="small" onClick={() => onClick()}>
      {children}
    </Button>
  );
};
export default withRouter((props) => {
  const {
    isInConferenceRoom,
    setIsInConferenceRoom,
    isInNetworkingCall,
    isNetworkingAvailable,
    eventSession,
    myUser,
  } = props;
  let [goToNetworkingDialog, setGoToNetworkingDialog] = useState(false);
  let [goToConferenceDialog, setGoToConferenceDialog] = useState(false);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = useStyles();

  const handleConferenceRoomClick = () => {
    if (isInNetworkingCall) {
      setGoToConferenceDialog(true);
    } else {
      setIsInConferenceRoom(true);
    }
  };

  const handleNetworkingRoomClick = () => {
    setGoToNetworkingDialog(true);
  };

  return (
    <React.Fragment>
      <AppBar className={clsx(classes.root)}>
        <Toolbar style={{ position: "relative" }}>
          <img alt="Logo" src={VeertlyLogo} className={classes.logo} />
          {!isMobile && eventSession && (
            <div className={classes.roomButtonsContainer}>
              <RoomButton isCurrentRoom={isInConferenceRoom} onClick={handleConferenceRoomClick}>
                Main Stage
              </RoomButton>
              <RoomButton
                isCurrentRoom={!isInConferenceRoom}
                onClick={handleNetworkingRoomClick}
                disabled={!isNetworkingAvailable}
              >
                Networking Area
              </RoomButton>
            </div>
          )}
          {/* </RouterLink> */}
          <div className={classes.flexGrow}>
            {!isMobile && eventSession && (
              // <div className={classes.title}>
              <Typography variant="h5" align="left" style={{ fontWeight: "lighter" }} className={classes.title}>
                {eventSession.title}
              </Typography>
            )}
          </div>
          <div className={classes.avatarContainer}>
            {/* <AvatarLogin eventSession={eventSession} /> */}
            <UserAvatar user={myUser} />
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
