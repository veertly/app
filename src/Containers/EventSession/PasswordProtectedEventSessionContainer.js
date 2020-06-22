import React, { useState, useEffect, useMemo } from "react";
// import { useSelector, shallowEqual } from "react-redux";
// import { getFeatureDetails, getUserSession } from "../../Redux/eventSession";
import { FEATURES } from "../../Modules/features";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { useDocumentData } from "react-firebase-hooks/firestore";
import firebase, { loginInEvent } from "../../Modules/firebaseApp";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import SplashScreen from "../../Components/Misc/SplashScreen";
import CompatibilityDialog from "../../Components/Shared/CompatibilityDialog";
import EventSessionContainerWrapper from "./EventSessionContainerWrapper";
// import AudioVideoCheckDialog from "../../Components/EventSession/AudioVideoCheckDialog";
// import TechnicalCheckProvider from "./TechnicalCheckProvider";
// import { Switch } from "@material-ui/core";
// import VideocamIcon from "@material-ui/icons/Videocam";
// import VideocamOffIcon from "@material-ui/icons/VideocamOff";
// import MicIcon from "@material-ui/icons/Mic";
// import MicOffIcon from "@material-ui/icons/MicOff";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > * + *": {
      marginTop: theme.spacing(4)
    }
  },
  textField: {},
  dialog: {
    padding: theme.spacing(0)
    // margin: 0,
  },
  dialogTitle: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
  dialogContent: {
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
  button: ({ loading }) => ({
    opacity: loading ? 0.5 : 1,
    width: "30%"
  }),
  switchWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
}));



const AuthDialog = ({ handleSubmit, error, loading, code }) => {
  const styles = useStyles({ loading });
  const [password, setPassword] = React.useState(code ? code : "");

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClick = (e) => {
    handleSubmit(password);
    e.preventDefault();
  };

  return (
    <Dialog open className={styles.dialog} fullWidth maxWidth="xs">
      <DialogTitle className={styles.dialogTitle} id="form-dialog-title">
        Enter your access code
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <form className={styles.root} onSubmit={handleClick}>
          <TextField
            className={styles.textField}
            id="event-password-input"
            label="Access code"
            type="password"
            value={password}
            fullWidth
            helperText={error ? "Incorrect code" : ""}
            onChange={handleChange}
            error={error}
          ></TextField>
          <Button
            className={styles.button}
            // onClick={handleClick}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

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

  const passwordProtectedEvent = useMemo(
    () =>
      eventSessionsEnabledFeatures
        ? eventSessionsEnabledFeatures[FEATURES.PASSWORD_PROTECTED]
        : null,
    [eventSessionsEnabledFeatures]
  );

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

  const isAuthenticated = participantJoinedDetails
    ? participantJoinedDetails.isAuthenticated
    : null;

  useEffect(() => {
    if (
      passwordProtectedEvent &&
      passwordProtectedEvent.enabled &&
      !isAuthenticated
    ) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [passwordProtectedEvent, isAuthenticated, setShowDialog]);

  return {
    showDialog,
    loading: loadingAuth || loadingPartcipants || loadingFeatures
  };
};

const useLoginEvent = ({ eventSessionId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [codeCheckedOnce, setCodeCheckedOnce] = useState(false);

  const loginInEventFn = React.useCallback(
    (password) => {
      setLoading(true);
      setError(false);
      loginInEvent({
        password,
        eventSessionId
      })
        .then(function (result) {
          var success = result.data.success;
          if (success) {
            // setLoading(false);
            setError(false);
          } else {
            setLoading(false);
            setError(true);
          }
          setCodeCheckedOnce(true);
          // Read result of the Cloud Function.
        })
        .catch(function (error) {
          setLoading(false);
          setError(true);
        });
    },
    [eventSessionId]
  );

  return {
    loading,
    error,
    loginInEventFn,
    codeCheckedOnce
  };
};

const ProtectedEventSessionContainer = () => {
  const { sessionId, code } = useParams();

  const { showDialog, loading } = useAuth();
  // const [muteVideo, setMuteVideo] = useState(false);
  // const [muteAudio, setMuteAudio] = useState(false);
  // const classes = useStyles();

  const {
    error,
    loading: loadingEvent,
    loginInEventFn,
    codeCheckedOnce
  } = useLoginEvent({
    eventSessionId: sessionId
  });

  const handleSubmit = (password) => {
    if (password) {
      loginInEventFn(password);
    }
  };

  useEffect(() => {
    if (code && !codeCheckedOnce) {
      loginInEventFn(code);
    }
  }, [code, codeCheckedOnce, loginInEventFn]);

  // const handleClickPreview = () => {
  //   setShowAudioVideoCheck(false);
  // }

  if (loading || (code && !codeCheckedOnce)) {
    return <SplashScreen />;
  }

  if (showDialog) {
    return (
      <AuthDialog
        error={error}
        loading={loadingEvent}
        handleSubmit={handleSubmit}
        code={code}
      />
    );
  } 
  // else if (showAudioVideoCheck) {
  //  return (
  //   <AudioVideoCheckDialog 
  //     handleSubmit={handleClickPreview}
  //     sessionId={sessionId}
  //     setShowAudioVideoCheck={(showTechCheck) => setShowAudioVideoCheck(showTechCheck)}
  //     devicesPermissionGiven={devicesPermissionGiven}
  //     enterWithoutPermissions={enterWithoutPermissions}
  //   />
  //  )
  // }
  else {
    return (
      <>
        <EventSessionContainerWrapper />
        <CompatibilityDialog />
      </>
    );
  }
};

export default ProtectedEventSessionContainer;
