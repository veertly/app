import React from "react";
import { makeStyles /* , useTheme */ } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import ChatMessage from "./ChatMessage";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    overflow: "auto",
    flexWrap: "inherit",
  },
  messageContainer: {
    width: "100%",
  },
}));

export default (props) => {
  let { messages, user, users } = props;

  const classes = useStyles();
  return (
    <Grid container direction="column-reverse" justify="flex-start" alignItems="center" className={classes.root}>
      {messages &&
        messages.map((message) => (
          <Grid item key={message.messageId} className={classes.messageContainer}>
            <ChatMessage message={message} user={user} users={users} />
          </Grid>
        ))}
    </Grid>
  );
};
