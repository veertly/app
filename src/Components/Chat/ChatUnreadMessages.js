import React from "react";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: 0,
    right: 0

    // zIndex: 10000
  },
  button: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.spacing(3),
    width: 150,
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.getContrastText(theme.palette.primary.light),
    padding: theme.spacing(1, 0),
    opacity: 0.8,
    cursor: "pointer",
    "&:hover": {
      // backgroundColor: theme.palette.primary.main,
      opacity: 1
    }
  }
}));

function ChatUnreadMessages({ onClickUnread, numMessages = null }) {
  const classes = useStyles();

  const label = React.useMemo(() => {
    if (numMessages) {
      return numMessages + " new message" + (numMessages > 1 ? "s" : "");
    }
    return "New messages";
  }, [numMessages]);

  return (
    <div className={classes.root}>
      <div className={classes.button} onClick={onClickUnread}>
        <Typography align="center" variant="caption">
          {label}
        </Typography>
      </div>
    </div>
  );
}

export default ChatUnreadMessages;
