import React from "react";
import Layout from "./Layouts/CenteredLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../Modules/firebaseApp";
import EditProfileForm from "../Components/EditProfile/EditProfileForm";
import SplashScreen from "../Components/Misc/SplashScreen";
import { useHistory, useLocation } from "react-router-dom";
import routes from "../Config/routes";

const EditProfileContainer = () => {
  const [userAuth, initialising, error] = useAuthState(firebase.auth());
  const history = useHistory();
  const location = useLocation();

  let sessionId = React.useMemo(() => {
    return location.state && location.state.sessionId
      ? location.state.sessionId.toLowerCase()
      : null;
  }, [location]);

  const redirectUser = React.useCallback(() => {
    history.push(
      location.state && location.state.from
        ? location.state.from.pathname
        : routes.HOME()
    );
  }, [history, location]);

  if (initialising) {
    return <SplashScreen />;
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
            sessionId={sessionId ? sessionId.toLowerCase() : null}
            profileUpdatedCallback={redirectUser}
          />
        )}
      </div>
    </Layout>
  );
};
// EditProfileContainer.whyDidYouRender = true;
export default EditProfileContainer;
