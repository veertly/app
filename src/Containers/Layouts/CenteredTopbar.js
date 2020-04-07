import React from "react";
import { withRouter } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import VeertlyLogo from "../../Assets/Veertly_white.svg";
import firebase from "../../Modules/firebaseApp";

import AvatarLogin from "../../Components/Topbar/AvatarLogin";
import Container from "@material-ui/core/Container";
import routes from "../../Config/routes";
import { useAuthState } from "react-firebase-hooks/auth";

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
  buttonLink: {
    "&:hover": {
      color: theme.palette.secondary.main,
    },
    marginRight: 32,
  },
}));

const FullTopbar = (props) => {
  const { className, showCreate } = props;
  const [user] = useAuthState(firebase.auth());

  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)}>
      <Container maxWidth="lg">
        <Toolbar>
          <a href="https://veertly.com">
            <img alt="Logo" src={VeertlyLogo} className={classes.logo} />
          </a>
          <div className={classes.flexGrow} />
          <div style={{ display: "flex" }}>
            {showCreate && (
              <div>
                <Button
                  variant="outlined"
                  color="secondary"
                  href={routes.CREATE_EVENT_SESSION()}
                  className={classes.buttonLink}
                  style={{ marginTop: user ? 4 : 0 }}
                >
                  Create your event
                </Button>
              </div>
            )}
            <AvatarLogin />
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

FullTopbar.propTypes = {
  className: PropTypes.string,
};

export default withRouter(FullTopbar);
