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
import {
  useDocumentData,
} from "react-firebase-hooks/firestore";
import firebase, { loginInEvent } from "../../Modules/firebaseApp";
import {
  useParams
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import SplashScreen from "../../Components/Misc/SplashScreen";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > * + *": {
      marginTop: theme.spacing(4),
    },
  },
  textField: {
  }, 
  dialog: {
    padding: theme.spacing(4),
  },
  dialogTitle: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  dialogContent: {
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  button: ({ loading }) => ({
    opacity: loading ? 0.5 : 1,
    width: "30%"
  })
}));


const AuthDialog = ({ handleSubmit, error, loading }) => {
  const styles = useStyles({ loading });
  const [password, setPassword] = React.useState("");

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClick = () => {
    handleSubmit(password);
  }

  return (
    <Dialog
      open
      className={styles.dialog}
      fullWidth="xs"
      maxWidth="xs"
    >
      <DialogTitle
      className={styles.dialogTitle}
      id="form-dialog-title">Enter password for the event</DialogTitle>
      <DialogContent
      className={styles.dialogContent}
      >
          <form className={styles.root}>
            <TextField
              className={styles.textField}
              id="event-password-input"
              label="Password"
              type="password"
              value={password}
              fullWidth
              helperText={error ? "Incorrect Password" : ""}
              onChange={handleChange}
              error={error}
            ></TextField>
            <Button 
              className={styles.button}
              onClick={handleClick}
              variant="contained" color="primary">
              Submit
            </Button>
          </form>
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



const useLoginEvent = ({ eventSessionId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loginInEventFn = (password) => {
    setLoading(true);
    setError(false);
    loginInEvent({
      password,
      eventSessionId,
    }).then(function(result) {
      var success = result.data.success;
      if (success) {
        // setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(true);
      }
      // Read result of the Cloud Function.
    }).catch(function(error) {
      setLoading(false);
      setError(true);
    })
  }

  return {
    loading,
    error,
    loginInEventFn
  }
}

const ProtectedEventSessionContainer = () => {
  const { sessionId } = useParams();

  const {
    showDialog,
    loading
  } = useAuth();

  const {
    error,
    loading: loadingEvent,
    loginInEventFn
  } = useLoginEvent({
    eventSessionId: sessionId,
  });

  const handleSubmit = (password) => {
    if(password) {
      loginInEventFn(password);
    }
  }

  if (loading) {
    return(
      <SplashScreen />
    )
  }

  if (loading || showDialog) {
    return (
      <AuthDialog 
        error={error}
        loading={loadingEvent}
        handleSubmit={handleSubmit}   
      />
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
