import React from "react";
import { makeStyles } from "@material-ui/styles";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../Modules/firebaseApp";
import routes from "../../Config/routes";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/account";
import { Link as RouterLink, useLocation, useHistory } from "react-router-dom";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

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
  },
  buttonLink: {
    "&:hover": {
      color: theme.palette.secondary.main
    }
  }
}));

export default (props) => {
  // const [openEditProfile, setOpenEditProfile] = React.useState(false);

  const classes = useStyles();
  const [userAuth] = useAuthState(firebase.auth());
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [myEvents] = useCollectionDataOnce(
    firebase
      .firestore()
      .collection("eventSessionsDetails")
      .where("owner", "==", userAuth ? userAuth.uid : "0x00")
      .limit(1)
  );

  function handleClose() {
    setAnchorEl(null);
  }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  const getAvatarLetters = () => {
    let names = userAuth.displayName.split(" ");
    let firstName = names[0];
    let lastName = names.length > 1 ? names[names.length - 1] : "";
    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  };

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
              {/* {!userAuth.displayName && <span>G</span>} */}
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
            <MenuItem
              onClick={() => {
                history.push(routes.EDIT_PROFILE(), { from: location });
                handleClose();
              }}
            >
              My Profile
            </MenuItem>
            {myEvents && myEvents.length > 0 && (
              <MenuItem
                onClick={() => {
                  window.open("https://cockpit.veertly.com", "_blank");
                  handleClose();
                }}
              >
                My Events
              </MenuItem>
            )}
            {/* Open on a dialog (shown only on the event session)
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
            )} */}

            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </div>
      )}
      {!userAuth && (
        <div>
          <Button
            variant="outlined"
            color="secondary"
            component={RouterLink}
            to={{
              pathname: routes.LOGIN(),
              state: { from: location }
            }}
            className={classes.buttonLink}
            // style={{ marginTop: user ? 4 : 0 }}
          >
            Login
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};
