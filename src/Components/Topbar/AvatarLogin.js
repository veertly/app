import React from "react";
import { makeStyles } from "@material-ui/styles";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../Modules/firebaseApp";
import routes from "../../Config/routes";
import { useDispatch } from "react-redux";
import { openEditProfile } from "../../Redux/dialogs";
import { logout } from "../../Redux/account";

const useStyles = makeStyles((theme) => ({
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

export default (props) => {
  const { eventSession } = props;

  // const [openEditProfile, setOpenEditProfile] = useState(false);

  const classes = useStyles();
  const [userAuth] = useAuthState(firebase.auth());
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const isOwner =
    eventSession && userAuth && eventSession.owner === userAuth.uid;

  function handleClose() {
    setAnchorEl(null);
  }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleLogout = () => {
    let sessionId = eventSession ? eventSession.id : null;
    dispatch(logout(sessionId));
  };

  const getAvatarLetters = () => {
    let names = userAuth.displayName.split(" ");
    let firstName = names[0];
    let lastName = names.length > 1 ? names[names.length - 1] : "";
    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  };

  const openProfile = React.useCallback(() => dispatch(openEditProfile()), [
    dispatch
  ]);

  return (
    <React.Fragment>
      {userAuth && (
        <div>
          {userAuth && userAuth.photoURL && (
            <Avatar
              alt=""
              src={userAuth.photoURL}
              className={classes.avatar}
              onClick={handleMenu}
            />
          )}
          {userAuth && !userAuth.photoURL && (
            <Avatar className={classes.avatar} onClick={handleMenu}>
              {userAuth.displayName && <span>{getAvatarLetters()}</span>}
              {!userAuth.displayName && <span>G</span>}
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
                  openProfile();
                  handleClose();
                }}
              >
                Profile
              </MenuItem>
            )}
            {isOwner && (
              <MenuItem
                onClick={() => {
                  window.open(
                    routes.EDIT_EVENT_SESSION(eventSession.id),
                    "_blank"
                  );
                  handleClose();
                }}
              >
                Edit Event
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </div>
      )}
    </React.Fragment>
  );
};
