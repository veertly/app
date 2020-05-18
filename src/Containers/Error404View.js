import React from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Page from "../Components/Core/Page";
import { useHistory } from "react-router-dom";
import routes from "../Config/routes";
import CenteredTopbar from "./Layouts/CenteredTopbar";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64
    },
    position: "relative"
  },
  image: {
    maxWidth: 300,
    marginTop: theme.spacing(4)
  }
}));

export default (props) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Page title={"Veertly | Page not found"}>
      <div className={classes.root}>
        <CenteredTopbar />

        <div style={{ textAlign: "center" }}>
          <img
            src="/illustrations/404_page_not_found.svg"
            className={classes.image}
            alt="Page not found"
          />
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: 32,
              marginBottom: 32
            }}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => history.push(routes.HOME())}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};
