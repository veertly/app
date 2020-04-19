import React from "react";
import Layout from "./Layouts/CenteredLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../Modules/firebaseApp";
import EditProfileForm from "../Components/EditProfile/EditProfileForm";
import { useHistory, useLocation } from "react-router-dom";

export default () => {
  const [userAuth, initialising, error] = useAuthState(firebase.auth());
  const history = useHistory();
  const location = useLocation();
  let callbackUrl = location.search.replace("?callback=", ""); // queryValues.callback ? queryValues.callback : "/";

  let { sessionId, isInSessionPage } = React.useMemo(() => {
    let sessionId = undefined;
    let splits = callbackUrl.split("/");
    if (splits[1] === "v") {
      sessionId = splits[2];
    }
    sessionId = sessionId.replace("/live", "");
    return {
      sessionId: sessionId ? sessionId.toLowerCase() : null,
      isInSessionPage: sessionId !== undefined,
    };
  }, [callbackUrl]);

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
        {userAuth && (
          <EditProfileForm
            userAuth={userAuth}
            sessionId={isInSessionPage ? sessionId.toLowerCase() : null}
            profileUpdatedCallback={redirectUser}
          />
        )}
      </div>
    </Layout>
  );
};
