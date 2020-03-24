import React from "react";
import { withRouter } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Typography, Button, Grid } from "@material-ui/core";
import moment from "moment";
import { registerToEvent } from "../../Modules/eventsOperations";

import VeertlyLogo from "../../Assets/Veertly_white.svg";
import ReactMarkdown from "react-markdown";
import routes from "../../Config/routes";

const styles = theme => ({
  avatar: {
    marginTop: 1,
    width: 80,
    height: 80
  },
  container: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(14),
    display: "flex",
    flexDirection: "column"
  },
  button: {
    minWidth: 200,
    justifyContent: "center",
    textAlign: "center"
  },
  backdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundImage: `url(${"https://images.unsplash.com/photo-1560264401-b76ed96f3134?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"})`,
    opacity: 0.3,
    zIndex: -1
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    zIndex: -2
  },
  arrowDown: {
    position: "absolute",
    bottom: theme.spacing(4)
  },
  joinButtonWrapper: {
    marginTop: theme.spacing(2),
    textAlign: "center"
  },
  "@media (min-width: 960px)": {
    rightColumn: {
      marginLeft: "0.75rem"
    }
  },
  marginTop: {
    marginTop: theme.spacing(3)
  },
  rightColumn: {
    marginTop: theme.spacing(3),
    boxShadow: "none",
    margin: "1rem 0 0"
  },
  header: {
    width: "100%"
  },
  row: {
    flex: "1",
    flexDirection: "row"
  },
  titleContainer: {
    margin: theme.spacing(3),
    textTransform: "uppercase"
  },
  descriptionContainer: {
    padding: theme.spacing(3)
  },
  logoContainer: {
    backgroundColor: theme.palette.primary.main,
    height: 200
  },
  buttonContainer: {
    height: 100
  }
});

function EventShow(props) {
  const { classes, event, eventId, user } = props;

  function handleRegisterToEvent() {
    registerToEvent(eventId, user.uid);
  }

  function hasJoined() {
    if (event.participants !== undefined && user !== null) {
      return event.participants[user.uid] !== null;
    }
  }

  return (
    <div>
      <Grid container className={classes.logoContainer} direction="row" justify="center" alignItems="center">
        <img alt="Logo" src={VeertlyLogo} className={classes.logo} />
      </Grid>
      <Container>
        <div className={classes.titleContainer}>
          <Typography variant="h5" align="center" gutterBottom>
            {event.title}
          </Typography>
          <Typography align="center" color="primary">
            {moment.unix(event.startTimestamp).calendar()}
          </Typography>
        </div>
        <div className={classes.descriptionContainer}>
          <ReactMarkdown source={event.description.replace("\\n", "\n")} />
        </div>
      </Container>
      <Grid container className={classes.buttonContainer} direction="row" justify="center" alignItems="center">
        {user && (
          <React.Fragment>
            {hasJoined() ? (
              <Typography variant="overline" color="textSecondary" align="center">
                You have already joined! <br />
                Thank you!
              </Typography>
            ) : (
              <Button
                onClick={() => handleRegisterToEvent()}
                className={classes.button}
                variant="contained"
                color="secondary"
              >
                JOIN THIS EVENT
              </Button>
            )}
          </React.Fragment>
        )}
        {!user && (
          <React.Fragment>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => props.history.push(routes.GO_TO_LOGIN(props.location.pathname))}
            >
              Log in to Join this meetup
            </Button>
          </React.Fragment>
        )}
      </Grid>
    </div>
  );

  /* 
      <section>
      <PaddedPaper className={classes.header}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Typography variant="h4">{event.title}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>Share on social media</Typography>
          <div className={classes.row}>
            <FacebookShareButton url={window.location.href} ><FacebookIcon size={32} round={true} /></FacebookShareButton>
            <TwitterShareButton url={window.location.href} ><TwitterIcon size={32} round={true} /></TwitterShareButton>
          </div>
        </Grid>
      </Grid>
    </PaddedPaper>
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <PaddedPaper className={classes.container}>
          <img height="200" width="400" src={event.imageUrl} />
          <Typography variant="h4">What we'll do</Typography>
          <Typography>{event.description}</Typography>
        </PaddedPaper>
      </Grid>
      <Grid item xs={3} className={[classes.rightColumn]}>
        <TitledPaper title="Join">
          <div className={classes.joinButtonWrapper}>
            {hasJoined() ? <Typography>You already joined!</Typography> : <Button
              onClick={() => handleRegisterToEvent()}
              className={classes.button}
              variant="contained"
              color="secondary"
              size="small"
            >
              JOIN THIS MEETUP
        </Button>}
          </div>
        </TitledPaper>
        <TitledPaper title="When" paddedPaperClassName={classes.marginTop}>
          <p><i className="icon calendar"></i>{moment.unix(event.startTimestamp).format('LL')}</p>
          <p><i className="icon info"></i>{moment.unix(event.startTimestamp).format('h:mm A')}</p>
        </TitledPaper>
      </Grid>
    </Grid>
  </section > */
}

export default withStyles(styles)(withRouter(EventShow));
