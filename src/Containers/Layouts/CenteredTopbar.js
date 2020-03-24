import React from "react";
import { withRouter } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar } from "@material-ui/core";
import VeertlyLogo from "../../Assets/Veertly_white.svg";

import AvatarLogin from "../../Components/Topbar/AvatarLogin";
import Container from "@material-ui/core/Container";

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
    width: 180
    // marginTop: theme.spacing(1)
  }
}));

const FullTopbar = props => {
  const { className } = props;

  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)}>
      <Container maxWidth="lg">
        <Toolbar>
          {/* <RouterLink to="/"> */}
          <img alt="Logo" src={VeertlyLogo} className={classes.logo} />
          {/* </RouterLink> */}
          <div className={classes.flexGrow} />
          <AvatarLogin />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

FullTopbar.propTypes = {
  className: PropTypes.string
};

export default withRouter(FullTopbar);
