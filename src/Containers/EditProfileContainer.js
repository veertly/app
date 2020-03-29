import React from "react";
import Layout from "./Layouts/CenteredLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../Modules/firebaseApp";
import EditProfileForm from "../Components/EditProfile/EditProfileForm";

export default () => {
  const [user, initialising, error] = useAuthState(firebase.auth());

  if (initialising) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }
  return (
    <Layout maxWidth="sm">
      <div style={{ margin: 48 }}>{user && <EditProfileForm user={user} />}</div>
    </Layout>
  );
};
