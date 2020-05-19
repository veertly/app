import React from "react";
import { useHistory, useLocation } from "react-router";
import {
  Avatar,
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  makeStyles,
  Divider,
  Link
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
// import { Alert } from '@material-ui/lab';
// import LockIcon from '@material-ui/icons/Lock';
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
// import { useAuthState } from 'react-firebase-hooks/auth';
import {
  trackPage,
  trackIdentify,
  trackEvent
} from "../../../Modules/analytics";

import Page from "../../../Components/Core/Page";

import LogoIcon from "../../../Components/Misc/LogoIcon";
import LoginForm from "./LoginForm";
import routes from "../../../Config/routes";

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    backgroundColor: theme.palette.background.dark,
    display: "flex",
    height: "100%",
    minHeight: "100%",
    flexDirection: "column",
    paddingBottom: 80,
    paddingTop: 80
  },
  backButton: {
    marginLeft: theme.spacing(2)
  },
  card: {
    overflow: "visible",
    display: "flex",
    position: "relative",
    "& > *": {
      flexGrow: 1,
      flexBasis: "50%",
      width: "50%"
    }
  },
  content: {
    padding: theme.spacing(8, 4, 3, 4)
  },
  icon: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    position: "absolute",
    top: -32,
    left: theme.spacing(3),
    height: 64,
    width: 64
  },
  media: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    padding: theme.spacing(3),
    color: theme.palette.common.white,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  }
}));

function LoginView({ loginWithEmail }) {
  const classes = useStyles();
  const history = useHistory();
  // const [userAuth, initialising /* error */] = useAuthState(firebase.auth());
  const location = useLocation();

  React.useEffect(() => {
    trackPage("LoginPage");
  }, []);

  const handleSubmitSuccess = (user) => {
    trackIdentify(user.id, {});
    trackEvent("Logged In");
    history.push(
      location.state && location.state.from
        ? location.state.from.pathname
        : routes.HOME()
    );
  };

  return (
    <Page className={classes.root} title="Veertly | Login">
      <Container maxWidth="xs">
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Avatar className={classes.icon}>
              <LogoIcon />
            </Avatar>
            <Typography variant="h4" color="primary">
              Sign in
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Sign in on the Veertly platform
            </Typography>
            <Box mt={3}>
              <LoginForm
                onSubmitSuccess={handleSubmitSuccess}
                loginWithEmail={loginWithEmail}
              />
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <Box align="center">
              <Link
                component={RouterLink}
                to={{
                  pathname: routes.LOGIN_REGISTER(),
                  state: location.state
                }}
                variant="body2"
                color="textSecondary"
              >
                Create new account
              </Link>
            </Box>
          </CardContent>
          {/* <CardMedia
            className={classes.media}
            image="/static/images/auth.png"
            title="Cover"
          >
            <Typography color="inherit" variant="subtitle1">
              Hella narvwhal Cosby sweater McSweeney&apos;s, salvia kitsch
              before they sold out High Life.
            </Typography>
            <Box alignItems="center" display="flex" mt={3}>
              <Avatar alt="Person" src="/static/images/avatars/avatar_2.png" />
              <Box ml={3}>
                <Typography color="inherit" variant="body1">
                  Ekaterina Tankova
                </Typography>
                <Typography color="inherit" variant="body2">
                  Manager at inVision
                </Typography>
              </Box>
            </Box>
          </CardMedia> */}
        </Card>
      </Container>
    </Page>
  );
}

export default LoginView;
