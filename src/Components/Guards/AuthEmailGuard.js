import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import routes from "../../Config/routes";
import { logout } from "../../Redux/account";

function AuthEmailGuard({ children }) {
  const account = useSelector((state) => state.account);

  const location = useLocation();
  const dispatch = useDispatch();
  const [logoutRequested, setLogoutRequested] = React.useState(false);

  React.useEffect(() => {
    if (account.user && account.user.isAnonymous && !logoutRequested) {
      dispatch(logout());
      setLogoutRequested(true);
    }
  }, [account.user, dispatch, logoutRequested]);

  if (!account.user || account.user.isAnonymous) {
    return (
      <Redirect
        to={{
          pathname: routes.LOGIN(),
          state: { from: location, denyAnonymous: true }
        }}
      />
    );
  }
  return children;
}

AuthEmailGuard.propTypes = {
  children: PropTypes.any
};

export default AuthEmailGuard;
