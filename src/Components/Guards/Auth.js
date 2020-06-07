import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import SplashScreen from "../Misc/SplashScreen";
import { setUserData, logout } from "../../Redux/account";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserDb } from "../../Modules/userOperations";
import firebase from "../../Modules/firebaseApp";

function Auth({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [user, initialising] = useAuthState(firebase.auth());
  const account = useSelector((state) => state.account);

  useEffect(() => {
    const initAuth = async () => {
      if (!initialising && user && account.user) {
        try {
          const userDb = await getUserDb(user.uid);
          dispatch(setUserData(userDb));
          setLoading(false);
        } catch (e) {
          console.log(
            "couldn't get the my user from the db with uid " + user.uid
          );
          dispatch(logout());
          setLoading(false);
        }
      } else if (!initialising) {
        setLoading(false);
      }
    };

    initAuth();
  }, [dispatch, user, initialising, account.user]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return children;
}

Auth.propTypes = {
  children: PropTypes.any
};

export default Auth;
