import React from "react";
import { withRouter } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar } from "@material-ui/core";
import VeertlyLogo from "../../Assets/Veertly_white.svg";

import AvatarLogin from "../../Components/Topbar/AvatarLogin";
import Container from "@material-ui/core/Container";
// import useMediaQuery from "@material-ui/core/useMediaQuery";

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
    width: 150
    // marginTop: theme.spacing(1)
  },
  buttonLink: {
    "&:hover": {
      color: theme.palette.secondary.main
    },
    marginRight: 32
  }
}));

const CenteredTopBar = (props) => {
  const { className } = props;

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
            {/* {showCreate && !isMobile && (
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
            )} */}
            <AvatarLogin />
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

CenteredTopBar.propTypes = {
  className: PropTypes.string
};

export default withRouter(CenteredTopBar);
