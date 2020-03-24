import { withRouter } from "react-router-dom";
import React, { useEffect } from "react";
import EventShow from "../Components/EventShow/EventShow";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import * as firebase from "firebase";
import { makeStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AvatarLogin from "../Components/Topbar/AvatarLogin";
import routes from "../Config/routes";

const useStyles = makeStyles(theme => ({
  root: {
    //backgroundColor: theme.palette.primary.light,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
    // width: "100%"
    // padding: theme.spacing(3)
  },
  bgContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: "50%",
    width: "100%",
    backgroundColor: theme.palette.primary.light
  },
  mainContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: "100%",
    padding: theme.spacing(3)
    // height: "50%",
    // margin: "auto"
    // position: "absolute",
    // top: theme.spacing(10)
    // backgroundColor: "#fff"
  },
  avatarLogin: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

function EventShowContainer(props) {
  const eventSlug = props.match.params.id;
  // const pathname = props.location.pathname;
  // console.log("props", props);

  useEffect(() => {
    window.analytics.page("EventPage/" + eventSlug);
  }, []);

  const classes = useStyles();

  const [user, loadingUser] = useAuthState(firebase.auth());
  const [event, loadingEvent, errorSession] = useDocumentData(
    firebase
      .firestore()
      .collection("events")
      .doc(eventSlug)
  );

  if (errorSession) {
    console.error(errorSession);
    return <p>Error :(</p>;
  }

  if (loadingEvent || loadingUser) {
    return <p>Loading...</p>;
  }

  let isEventLive = event.joinButtonAvailableAt ? new Date().getTime() / 1000 > event.joinButtonAvailableAt : true;
  if (isEventLive) {
    props.history.push(routes.EVENT_SESSION(event.sessionId));
  }
  // console.log(event);
  return (
    <div className={classes.root}>
      <div className={classes.bgContainer} />
      <div className={classes.avatarLogin}>
        <AvatarLogin />
      </div>
      {/* <div className={classes.shiftDown} />
      <div className={classes.mainContainer}> */}
      <Grid container className={classes.mainContainer} direction="row" justify="center" alignItems="center">
        <Grid sm={6} justify="center" alignItems="center">
          <Paper>
            <EventShow user={user} eventId={eventSlug} event={event} />
          </Paper>
        </Grid>
      </Grid>
      {/* </div> */}
    </div>
  );
}

export default withRouter(EventShowContainer);
