import React from "react";
import ChatIcon from "@material-ui/icons/Chat";

import { Box, makeStyles, Typography, Button } from "@material-ui/core";
import ErrorImg from "../../Assets/illustrations/undraw_server_down_s4lk.svg";
import Logo from "./Logo";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    left: 0,
    padding: theme.spacing(3),
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 2000
  },
  errorImg: {
    width: 350,
    maxWidth: "100%"
  },
  logo: {
    width: 200,
    maxWidth: "100%",
    position: "absolute",
    bottom: theme.spacing(3),
    textAlign: "center"
  },
  errorMsg: {
    padding: theme.spacing(3)
  }
}));

function ErrorPage({ message }) {
  const classes = useStyles();
  const handleChat = () => {
    // window.$crisp.push(["do", "chat:open"]);
    window.open(
      "https://go.crisp.chat/chat/embed/?website_id=e2d77fef-388b-4609-a944-238bdcc2fc70",
      "_blank"
    );
  };
  return (
    <div className={classes.root}>
      <Box display="flex" justifyContent="center">
        <img className={classes.errorImg} src={ErrorImg} alt="Error" />
      </Box>
      <Typography color="textSecondary" className={classes.errorMsg}>
        {message}
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Reload page
        </Button>
      </Box>
      <Box mt={4}>
        <Button
          // variant="contained"
          color="primary"
          onClick={handleChat}
          startIcon={<ChatIcon />}
        >
          Contact support
        </Button>
      </Box>
      <Box className={classes.logo}>
        <a href="/">
          <Logo />
        </a>
      </Box>
    </div>
  );
}

export default ErrorPage;
