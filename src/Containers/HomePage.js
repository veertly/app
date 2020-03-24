import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import CenteredTopbar from "./Layouts/CenteredTopbar";
import HomeComponent from "../Components/HomeComponent";
import TextField from "@material-ui/core/TextField";
import { subscribeNewsletter } from "../Modules/meetupOperations";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://veertly.com/">
        Veertly.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(12, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
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
    padding: theme.spacing(2, 6, 6, 6)
  },
  buttonJoin: {
    margin: "auto"
  },
  subscriptionField: {
    width: 200
  },
  buttonSubscribe: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(3)
  },
  subscriptionContainer: {
    marginBottom: theme.spacing(3)
  }
}));

export default () => {
  const classes = useStyles();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.analytics.page("Home");
  }, []);

  const handleSubscribeNewsletter = () => {
    if (newsletterEmail.trim() !== "") {
      subscribeNewsletter(newsletterEmail);
      setSubmitted(true);
    }
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <CenteredTopbar />
      <main>
        <HomeComponent />
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Container maxWidth="xs" className={classes.subscriptionContainer}>
          <Grid container direction="row" justify="center" alignItems="center">
            {!submitted && (
              <React.Fragment>
                <TextField
                  id="email"
                  label="Email address"
                  className={classes.subscriptionField}
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  margin="normal"
                  autoFocus={false}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  className={classes.buttonSubscribe}
                  onClick={handleSubscribeNewsletter}
                >
                  Subscribe
                </Button>
              </React.Fragment>
            )}
            {submitted && (
              <Typography className={classes.hintText} variant="caption">
                Thank you, you have been registered successfully
              </Typography>
            )}
          </Grid>
        </Container>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          info@veertly.com{" "}
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
};
