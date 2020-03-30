import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { withRouter } from "react-router-dom";
import routes from "../Config/routes";
import Page from "./Core/Page";
import VeertlyLogo from "../Assets/Veertly_white.svg";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(12, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(8)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  },
  buttonJoin: {
    margin: "auto"
  },
  textField: {
    maxWidth: 300,
    margin: "auto"
  },
  button: {
    margin: 16,
    width: 250
  },
  logoContainer: {
    [theme.breakpoints.down("xs")]: {
      textAlign: "center"
    }
  },
  logo: {
    maxWidth: "80%"
  },
  green: {
    color: theme.palette.secondary.main
  },
  headlineContainer: {
    marginTop: theme.spacing(6)
  },
  headline: {
    textAlign: "left",
    // fontWeight: "lighter",
    // marginBottom: 48,
    color: "white",
    // letterSpacing: theme.spacing(1),
    // fontSize: "2.8rem",
    [theme.breakpoints.down("xs")]: {
      // fontSize: "2rem",
      // letterSpacing: theme.spacing(0.5)
    }
  }
}));

export default withRouter(props => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <React.Fragment>
      {/* Hero unit */}
      <Page title="Veertly | Virtual events, virtual networking!"></Page>
      <div className={classes.heroContent}>
        <Container maxWidth="md">
          <div className={classes.logoContainer}>
            <img alt="Logo" src={VeertlyLogo} className={classes.logo} />
          </div>
          <div className={classes.headlineContainer}>
            <Typography variant="h1" className={classes.headline}>
              <span className={classes.green}>V</span>irtual events,{" "}
            </Typography>

            <Typography variant="h1" className={classes.headline}>
              <span className={classes.green}>V</span>irtual networking!
            </Typography>
          </div>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => props.history.push(routes.CREATE_EVENT_SESSION())}
                >
                  Create new event
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => props.history.push(routes.EVENT_SESSION("demo"))}
                >
                  Try demo event
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
});
