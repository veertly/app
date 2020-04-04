import React, { useEffect /*  { useContext } */ } from "react";
import { withRouter } from "react-router-dom";

import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../Modules/firebaseApp";
// import queryString from "query-string";
import CenteredLayout from "./Layouts/CenteredLayout";
import { makeStyles } from "@material-ui/styles";
import { registerNewUser, hasUserSession } from "../Modules/userOperations";
import { useAuthState } from "react-firebase-hooks/auth";
// import { GlobalContext } from "../Redux/GlobalContext";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import routes from "../Config/routes";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(10, 1, 3)
  }
}));

export default withRouter(props => {
  const [user, initialising /* error */] = useAuthState(firebase.auth());

  const classes = useStyles();
  // const queryValues = queryString.parse(props.location.search);
  // const callbackUrl = queryValues.callback ? queryValues.callback : "/";
  let callbackUrl = props.location.search.replace("?callback=", ""); // queryValues.callback ? queryValues.callback : "/";
  callbackUrl = callbackUrl.split("&")[0];
  // const { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    window.analytics.page("LoginPage");
  }, []);

  const checkAndRedirect = async uid => {
    let sessionId = callbackUrl.replace("/v/", "");
    let isInSessionPage = callbackUrl.includes("/v/");

    if (isInSessionPage) {
      let hasSession = await hasUserSession(sessionId, uid);
      if (hasSession) {
        props.history.push(callbackUrl);
      } else {
        props.history.push(routes.EDIT_PROFILE(callbackUrl));
      }
    } else {
      props.history.push(callbackUrl);
    }
  };
  const uiConfig = {
    signInFlow: "popup",
    // signInSuccessUrl: callbackUrl,
    callbacks: {
      signInSuccessWithAuthResult: async function(authResult, redirectUrl) {
        var user = authResult.user;
        // var credential = authResult.credential;
        var isNewUser = authResult.additionalUserInfo.isNewUser;
        // var providerId = authResult.additionalUserInfo.providerId;
        // var operationType = authResult.operationType;
        // Do something with the returned AuthResult.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        console.log(user);
        window.analytics.identify(user.uid, {});
        window.analytics.track("Logged In");

        if (isNewUser) {
          registerNewUser(user);
        }

        checkAndRedirect(user.uid);

        return false;
      }
    },
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // Whether the display name should be displayed in the Sign Up page.
        requireDisplayName: true
      }
    ]
  };
  if (initialising) {
    return null;
  }

  if (user) {
    // if (user.isAnonymous) {
    //   props.history.push(routes.EDIT_PROFILE(callbackUrl));
    // } else {
    //   props.history.push(callbackUrl);
    // }
    checkAndRedirect(user.uid);
  }

  const loginAnonymously = async () => {
    firebase
      .auth()
      .signInAnonymously()
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log({ errorCode, errorMessage });
      });
  };

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      // var isAnonymous = user.isAnonymous;
      // var uid = user.uid;
      // ...
      // console.log({ user });
    } else {
      // User is signed out.
      // ...
    }
    // ...
  });
  return (
    <CenteredLayout>
      {/* <Typography variant="subtitle1" align="center">
        Login
      </Typography> */}
      <div className={classes.root}>
        <Typography align="center" variant="overline" style={{ display: "block" }}>
          Please sign-in in order to enter in the veertly platform
        </Typography>
        <br />
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        <div style={{ textAlign: "center" }}>
          <Button variant="contained" style={{ width: 220 }} onClick={loginAnonymously}>
            Enter as a guest
          </Button>
        </div>
      </div>
    </CenteredLayout>
  );
});
