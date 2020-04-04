import React from "react";
import Layout from "./Layouts/CenteredLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../Modules/firebaseApp";
import EditProfileForm from "../Components/EditProfile/EditProfileForm";
import { useHistory, useLocation } from "react-router-dom";

export default () => {
  const [user, initialising, error] = useAuthState(firebase.auth());
  const history = useHistory();
  const location = useLocation();

  let callbackUrl = location.search.replace("?callback=", ""); // queryValues.callback ? queryValues.callback : "/";
  let sessionId = callbackUrl.replace("/v/", "");

  const redirectUser = () => {
    history.push(callbackUrl);
  };

  if (initialising) {
    return <p>Loading...</p>;
  }
  // <EditProfileForm user={user} sessionId={eventSession.id} profileUpdatedCallback={handleClose} />

  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }
  return (
    <Layout maxWidth="sm">
      <div style={{ padding: "48px 24px" }}>
        {/* <Typography>Feel free to share the information</Typography> */}
        {user && <EditProfileForm user={user} sessionId={sessionId} profileUpdatedCallback={redirectUser} />}
      </div>
    </Layout>
  );
};
