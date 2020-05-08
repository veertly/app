import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { getFeatureDetails, getUserSession } from "../../Redux/eventSession";
import { FEATURES } from "../../Modules/features";
import EventSessionContainer from "./EventSessionContainer";

const ProtectedEventSessionContainer = () => {
  const passwordProtectedEvent = useSelector(getFeatureDetails(FEATURES.PASSWORD_PROTECTED), shallowEqual);
  const userSession = useSelector(getUserSession);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    if (passwordProtectedEvent && passwordProtectedEvent.enabled && !userSession.isAuthenticated) {
      setShowPasswordDialog(true);
    }
  }, [userSession, passwordProtectedEvent, showPasswordDialog])

  // check if the event is password protected. if not render the page, if yes:
  // check if user has entered the password. if yes render the page, if no:
  // show dialog to ask for password
  if (!showPasswordDialog) {
    return (<EventSessionContainer />)
  }
  // show dialog here
  return (
    <></>
  )
};

export default ProtectedEventSessionContainer;
