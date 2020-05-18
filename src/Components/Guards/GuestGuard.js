import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import routes from "../../Config/routes";

function GuestGuard({ children }) {
  const account = useSelector((state) => state.account);

  if (account.user) {
    return <Redirect to={routes.HOME()} />;
  }

  return children;
}

GuestGuard.propTypes = {
  children: PropTypes.any
};

export default GuestGuard;
