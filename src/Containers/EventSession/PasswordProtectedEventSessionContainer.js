import React, { useState, useEffect, useMemo } from "react";
// import { useSelector, shallowEqual } from "react-redux";
// import { getFeatureDetails, getUserSession } from "../../Redux/eventSession";
import { FEATURES } from "../../Modules/features";
import EventSessionContainer from "./EventSessionContainer";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {
  useDocumentData,
} from "react-firebase-hooks/firestore";
import firebase, { functionsApp } from "../../Modules/firebaseApp";
import {
  useParams
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import SplashScreen from "../../Components/Misc/SplashScreen";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1.5),
      // width: "25ch",
    },
  },
  textField: {
    width: 300
  }
}));


const AuthDialog = ({ handleSubmit }) => {
  const styles = useStyles();
  const [password, setPassword] = React.useState("");

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClick = (event) => {
    console.log(password)
    handleSubmit(password);
  }

  return (
    <Dialog
      open
    >
      <DialogTitle id="form-dialog-title">Enter password for event</DialogTitle>
      <DialogContent
      >
        <Grid
          className={styles.root}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <TextField
            className={styles.textField}
            id="event-password-input"
            label="Password"
            type="password"
            value={password}
            onChange={handleChange}
          ></TextField>
          <Button 
          onClick={handleClick}
          variant="contained" color="primary">
            Submit
          </Button>
        </Grid>

      </DialogContent>
    </Dialog>
  )
}

  // check if the event is password protected. if not render the page, if yes:
  // check if user has entered the password. if yes render the page, if no:
  // show dialog to ask for password
  
const useAuth = () => {
  
  const [showDialog, setShowDialog] = useState(false);

  const { sessionId } = useParams();

  const [eventSessionsEnabledFeatures, loadingFeatures] = useDocumentData(
    firebase
      .firestore()
      .collection("eventSessionsEnabledFeatures")
      .doc(sessionId)
  );

  const passwordProtectedEvent = useMemo(() =>
  eventSessionsEnabledFeatures ? eventSessionsEnabledFeatures[FEATURES.PASSWORD_PROTECTED] : null, [eventSessionsEnabledFeatures]);

  const [userAuth, loadingAuth] = useAuthState(firebase.auth());

  const userId = useMemo(() => (userAuth ? userAuth.uid : null), [userAuth]);

  const [participantJoinedDetails, loadingPartcipants] = useDocumentData(
    firebase
    .firestore()
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(userId)
  );

  const isAuthenticated = participantJoinedDetails ? participantJoinedDetails.isAuthenticated : null;

  useEffect(() => {
    if (passwordProtectedEvent && passwordProtectedEvent.enabled && !isAuthenticated) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [passwordProtectedEvent, isAuthenticated, setShowDialog]);

  return {
    showDialog,
    loading: loadingAuth || loadingPartcipants || loadingFeatures
  }
}

const loginInEvent = functionsApp.httpsCallable("loginInEvent");
console.log(loginInEvent)
const ProtectedEventSessionContainer = () => {
  // let loginInEvent = firebase.functions().httpsCallable("loginInEvent");
  // console.log(functions)
  const { sessionId } = useParams();

  const {
    showDialog,
    loading
  } = useAuth();

  // show dialog here

  const handleSubmit = (password) => {
    if(password) {
      loginInEvent({
        password,
        eventSessionId: sessionId,
      }).then(function(result) {
        // Read result of the Cloud Function.
        // var sanitizedMessage = result.data.text;
      }).catch(function(error) {
        // Getting the Error details.
        // var code = error.code;
        // var message = error.message;
        // var details = error.details;
        // ...
      });
    }
  }

  if (loading) {
    return(
      <SplashScreen />
    )
  }

  if (loading || showDialog) {
    return (
      <AuthDialog handleSubmit={handleSubmit} />
    )
  } else {
    return (
      <>
        <EventSessionContainer></EventSessionContainer>
      </>
    )
  }

  
};

export default ProtectedEventSessionContainer;
