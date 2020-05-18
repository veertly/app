import React from "react";
import { useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import routes from "../../Config/routes";

function AuthGuard({ children }) {
  const account = useSelector((state) => state.account);

  const location = useLocation();

  if (!account.user) {
    return (
      <Redirect to={{ pathname: routes.LOGIN(), state: { from: location } }} />
    );
  }
  return children;
}

AuthGuard.propTypes = {
  children: PropTypes.any
};

export default AuthGuard;
