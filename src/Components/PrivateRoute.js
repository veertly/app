import React, { useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import routes from "../Config/routes";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../Modules/firebaseApp";

const PrivateRoute = ({ component: Component, path, location, history, ...rest }) => {
  const [user, initialising /* error */] = useAuthState(firebase.auth());

  useEffect(() => {
    if (initialising || user) {
      return;
    }
    const fn = async () => {
      history.push(routes.GO_TO_LOGIN(location.pathname));
    };
    fn();
  }, [history, initialising, user, path]);

  const render = props => (user ? <Component {...props} /> : null);

  return <Route exact={true} path={path} render={render} {...rest} />;
};

export default withRouter(PrivateRoute);
