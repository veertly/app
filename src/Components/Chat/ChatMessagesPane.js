import React, { useRef, useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import ChatMessage from "./ChatMessage";
import { useScroll, useUpdate, useScrolling } from "react-use";
import ChatUnreadMessages from "./ChatUnreadMessages";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    overflow: "auto",
    overflowX: "hidden",
    flexWrap: "inherit"
  },
  messagesContainerGrid: {
    flex: 1
  },
  messageContainer: {
    width: "100%"
  },
  shadowElement: {
    float: "left",
    clear: "both"
  }
}));

export default ({ user, users, messages }) => {
  const chatEnd = useRef(null);
  const scrollRef = React.useRef(null);

  const { y: scrollY } = useScroll(scrollRef);
  const scrolling = useScrolling(scrollRef);

  const isScrollAtBottom = !!(
    scrollRef.current &&
    scrollRef.current.scrollHeight - scrollY === scrollRef.current.clientHeight
  );

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const [lastTrackedMessagesJson, setLastTrackedMessagesJson] = useState(
    messages ? JSON.stringify(messages) : null
  );

  const [isForcingScroll, setIsForcingScroll] = useState(true);
  const [lastScrollingState, setLastScrollingState] = useState(false);
  const [countNewMessages, setCountNewMessages] = useState(0);

  const forceRender = useUpdate();

  const scrollToBottom = React.useCallback(
    () => chatEnd.current.scrollIntoView({ behavior: "auto" }),
    []
  );

  // handle new messages
  useEffect(() => {
    const currentMessagesJson = JSON.stringify(messages);
    if (currentMessagesJson !== lastTrackedMessagesJson) {
      if (isForcingScroll) {
        scrollToBottom();
        setCountNewMessages(0);
      } else {
        setCountNewMessages((v) => v + 1);
      }
      setLastTrackedMessagesJson(currentMessagesJson);
    }
  }, [isForcingScroll, lastTrackedMessagesJson, messages, scrollToBottom]);

  // force update of timestamps
  useEffect(() => {
    const intervalId = setInterval(() => {
      // setMessages((mess) => [...mess]);
      forceRender();
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [forceRender]);

  // initial scroll to bottom
  useEffect(() => {
    if (
      messages &&
      messages.length > 0 &&
      !hasScrolledToBottom &&
      scrollY === 0
    ) {
      chatEnd.current.scrollIntoView({ behavior: "auto" });
      setHasScrolledToBottom(true);
    }
  }, [hasScrolledToBottom, messages, scrollY]);

  // detect scroll changed
  useEffect(() => {
    if (scrolling !== lastScrollingState) {
      if (scrolling) {
        setIsForcingScroll(false);
      } else {
        setIsForcingScroll(isScrollAtBottom);
      }
      if (isScrollAtBottom) {
        setCountNewMessages(0);
      }
      setLastScrollingState(scrolling);
    }
  }, [isScrollAtBottom, lastScrollingState, scrolling]);

  const classes = useStyles();

  const onClickNewMessages = useCallback(() => {
    setCountNewMessages(0);
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    <div className={classes.root} ref={scrollRef}>
      <div ref={scrollRef}>
        <Grid
          container
          direction="column-reverse"
          justify="flex-start"
          alignItems="center"
          className={classes.messagesContainerGrid}
        >
          {messages &&
            messages.map((message) => (
              <Grid
                item
                key={message.messageId}
                className={classes.messageContainer}
                // ref={!firstMessageRef ? firstMessageRef : lastMessageRef}
              >
                <ChatMessage message={message} user={user} users={users} />
              </Grid>
            ))}
          {/* {loadingMore && (
          <Grid item className={classes.messageContainer}>
            <Typography variant="caption" display="block" align="center">
              Loading more messages...
            </Typography>
          </Grid>
        )} */}
        </Grid>
        <div className={classes.shadowElement} ref={chatEnd} />
      </div>
      {countNewMessages > 0 && (
        <ChatUnreadMessages
          numMessages={countNewMessages}
          onClickUnread={onClickNewMessages}
        />
      )}
    </div>
  );
};
