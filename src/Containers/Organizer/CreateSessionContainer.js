import React from "react";
import Layout from "../Layouts/CenteredLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../Modules/firebaseApp";
import EditEventSessionForm from "../../Components/Event/EditEventSessionForm";
import { withRouter } from "react-router-dom";
import Page from "../../Components/Core/Page";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0, 3, 0),
    [theme.breakpoints.up("sm")]: {
      margin: theme.spacing(6, 0),
    },
    padding: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: 16,
    // marginBottom: 16
  },
  button: {
    marginTop: theme.spacing(4),
  },
  bottom: {
    textAlign: "center",
  },
  stepperContainer: {
    width: "100%",
  },
  bannerContainer: {
    maxWidth: theme.breakpoints.values.sm,
    width: "100%",
    margin: "auto",
  },
  previewText: {
    maxWidth: theme.breakpoints.values.sm,
    width: "100%",
    margin: "auto",
    display: "block",
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
}));

export default withRouter((props) => {
  const classes = useStyles();

  const [user, initialising, error] = useAuthState(firebase.auth());

  if (initialising) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }
  return (
    <Layout maxWidth="md">
      <Page title="Veertly | Create new event">
        <Paper className={classes.root}>{user && <EditEventSessionForm user={user} />}</Paper>
      </Page>
    </Layout>
  );
});
