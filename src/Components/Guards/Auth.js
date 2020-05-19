import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import SplashScreen from "../Misc/SplashScreen";
import { setUserData } from "../../Redux/account";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserDb } from "../../Modules/userOperations";
import firebase from "../../Modules/firebaseApp";

function Auth({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [user, initialising] = useAuthState(firebase.auth());

  useEffect(() => {
    const initAuth = async () => {
      if (!initialising && user) {
        const userDb = await getUserDb(user.uid);
        await dispatch(setUserData(userDb));
        setLoading(false);
      } else if (!initialising) {
        setLoading(false);
      }
    };

    initAuth();
  }, [dispatch, user, initialising]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return children;
}

Auth.propTypes = {
  children: PropTypes.any
};

export default Auth;
