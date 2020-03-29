import React from 'react';
import { makeStyles } from '@material-ui/styles';

import Button from '@material-ui/core/Button';
import { useHistory, useLocation } from 'react-router-dom';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import routes from '../../Config/routes';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from '../../Modules/firebaseApp';
import { logout } from '../../Modules/userOperations';
import FormDialog from './EditProfile';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
  },
  flexGrow: {
    flexGrow: 1,
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
  },
  logo: {
    width: 180,
    marginTop: theme.spacing(1),
  },
}));

export default props => {
  const { eventSession } = props;
  const history = useHistory();
  const location = useLocation();

  const classes = useStyles();
  console.log({ location });
  const [user /* , initialising, error */] = useAuthState(firebase.auth());
  const handleLogout = () => {
    let sessionId = eventSession ? eventSession.id : null;
    logout(sessionId);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const onLogin = location.pathname === '/login';

  function handleClose() {
    setAnchorEl(null);
  }
  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }
  return (
    <React.Fragment>
      {!user && !onLogin && (
        <Button
          variant='contained'
          color='secondary'
          size='small'
          onClick={() => history.push(routes.GO_TO_LOGIN(location.pathname))}>
          Log in
        </Button>
      )}
      {user && (
        <div>
          {user && user.photoURL && (
            <Avatar
              alt=''
              src={user.photoURL}
              className={classes.avatar}
              onClick={handleMenu}
            />
          )}
          {user && !user.photoURL && (
            <Avatar className={classes.avatar} onClick={handleMenu}>
              {user.displayName && <span>{user.displayName.charAt(0)}</span>}
              {!user.displayName && <span>G</span>}
            </Avatar>
          )}
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            keepMounted
            open={open}
            onClose={handleClose}>
            {/* <MenuItem onClick={() => history.push(routes.EDIT_PROFILE())}>Profile</MenuItem> */}
            <MenuItem onClick={handleLogout}>LOG OUT</MenuItem>
            <FormDialog></FormDialog>
          </Menu>
        </div>
      )}
    </React.Fragment>
  );
};
