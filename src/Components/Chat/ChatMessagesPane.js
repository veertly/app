import React, { useRef, useEffect } from "react";
import { makeStyles /* , useTheme */ } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import ChatMessage from "./ChatMessage";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    overflow: "auto",
    flexWrap: "inherit",
  },
  messagesContainerGrid: {
    flex: 1,
  },
  messageContainer: {
    width: "100%",
  },
  shadowElement: {
    float:"left",
    clear: "both"
  }
}));

export default (props) => {
  const chatEnd = useRef(null);
  let { messages, user, users } = props;

  useEffect(() => {
    chatEnd.current.scrollIntoView({ behavior: "auto" });
  }, [props])

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container direction="column-reverse" justify="flex-start" alignItems="center" className={classes.messagesContainerGrid} >
        {messages &&
          messages.map((message) => (
            <Grid item key={message.messageId} className={classes.messageContainer}>
              <ChatMessage message={message} user={user} users={users} />
            </Grid>
          ))}
      </Grid>
      <div className={classes.shadowElement} ref={chatEnd} />
    </div>
  );
};
