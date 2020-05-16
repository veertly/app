import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import routes from "../../Config/routes";

function AuthGuard({ children }) {
  const account = useSelector((state) => state.account);

  if (!account.user) {
    return <Redirect to={routes.LOGIN()} />;
  }
  return children;
}

AuthGuard.propTypes = {
  children: PropTypes.any
};

export default AuthGuard;
