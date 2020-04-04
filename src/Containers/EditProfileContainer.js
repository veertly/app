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
  let isInSessionPage = callbackUrl.includes("/v/");

  const redirectUser = () => {
    history.push(callbackUrl);
  };

  if (initialising) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }
  return (
    <Layout maxWidth="sm">
      <div style={{ padding: "48px 24px" }}>
        {user && (
          <EditProfileForm
            user={user}
            sessionId={isInSessionPage ? sessionId : null}
            profileUpdatedCallback={redirectUser}
          />
        )}
      </div>
    </Layout>
  );
};
