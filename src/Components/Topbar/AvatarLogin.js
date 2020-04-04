import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";

import Button from "@material-ui/core/Button";
import { useHistory, useLocation } from "react-router-dom";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import routes from "../../Config/routes";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../Modules/firebaseApp";
import { logout } from "../../Modules/userOperations";
import EditProfileDialog from "../EditProfile/EditProfileDialog";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: "none"
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  logo: {
    width: 180,
    marginTop: theme.spacing(1)
  }
}));

export default props => {
  const { eventSession } = props;
  const history = useHistory();
  const location = useLocation();

  // if (!eventSession) {
  //   return null;
  // }

  const [openEditProfile, setOpenEditProfile] = useState(false);

  const classes = useStyles();
  const [user /* , initialising, error */] = useAuthState(firebase.auth());

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const onLogin = location.pathname === "/login";

  function handleClose() {
    setAnchorEl(null);
  }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleLogout = () => {
    let sessionId = eventSession ? eventSession.id : null;
    logout(sessionId);
  };

  const getAvatarLetters = () => {
    let names = user.displayName.split(" ");
    let firstName = names[0];
    let lastName = names.length > 1 ? names[names.length - 1] : "";
    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  };

  return (
    <React.Fragment>
      <EditProfileDialog open={openEditProfile} setOpen={setOpenEditProfile} user={user} eventSession={eventSession} />

      {!user && !onLogin && (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => history.push(routes.GO_TO_LOGIN(location.pathname))}
        >
          Log in
        </Button>
      )}
      {user && (
        <div>
          {user && user.photoURL && (
            <Avatar alt="" src={user.photoURL} className={classes.avatar} onClick={handleMenu} />
          )}
          {user && !user.photoURL && (
            <Avatar className={classes.avatar} onClick={handleMenu}>
              {user.displayName && <span>{getAvatarLetters()}</span>}
              {!user.displayName && <span>G</span>}
            </Avatar>
          )}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            keepMounted
            open={open}
            onClose={handleClose}
          >
            {eventSession && (
              <MenuItem
                onClick={() => {
                  setOpenEditProfile(true);
                  handleClose();
                }}
              >
                Profile
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </div>
      )}
    </React.Fragment>
  );
};
