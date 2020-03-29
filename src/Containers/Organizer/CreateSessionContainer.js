import React from "react";
import Layout from "../Layouts/CenteredLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../Modules/firebaseApp";
import EditEventSessionForm from "../../Components/EditEventSession/EditEventSessionForm";
import { withRouter } from "react-router-dom";
import Page from "../../Components/Core/Page";

export default withRouter(props => {
  const [user, initialising, error] = useAuthState(firebase.auth());
  let { sessionId } = props.match.params;

  if (initialising) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }
  return (
    <Layout maxWidth="sm">
      <Page title="Veertly | Create new event">
        {user && <EditEventSessionForm user={user} isNewEvent={true} sessionId={sessionId} />}
      </Page>
    </Layout>
  );
});
