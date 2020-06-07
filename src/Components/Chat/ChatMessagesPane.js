import React, { useRef, useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
import ChatMessage from "./ChatMessage";
import { useScroll, useUpdate, useScrolling, useDebounce } from "react-use";
import ChatUnreadMessages from "./ChatUnreadMessages";
import { useSelector } from "react-redux";
import { isEventOwner, getUserId } from "../../Redux/eventSession";
import NoChatMessagesImg from "../../Assets/illustrations/undraw_Group_chat_unwm.svg";

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
  },
  emptyPane: {
    marginTop: theme.spacing(4),
    textAlign: "center"
  },
  emptyImage: {
    width: "55%",
    marginBottom: theme.spacing(1)
  }
}));

export default ({ user, users, messages }) => {
  const chatEnd = useRef(null);
  const scrollRef = React.useRef(null);

  const { y } = useScroll(scrollRef);
  const [scrollY, setScrollY] = useState(y);
  useDebounce(
    () => {
      setScrollY(y);
      // console.log("Stopped debouncing y: " + y);
    },
    1000,
    [y]
  );

  const scrollingOriginal = useScrolling(scrollRef);
  const [scrolling, setScrolling] = useState(false);
  useDebounce(
    () => {
      setScrolling(scrollingOriginal);
      // console.log("Stopped debouncing scrollingOriginal: " + scrollingOriginal);
    },
    1000,
    [scrollingOriginal]
  );

  const isScrollAtBottom = !!(
    scrollRef.current &&
    scrollRef.current.scrollHeight - scrollY === scrollRef.current.clientHeight
  );

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const [lastTrackedMessagesJson, setLastTrackedMessagesJson] = useState(
    messages ? JSON.stringify(messages) : null
  );

  const [lastScrollingState, setLastScrollingState] = useState(false);
  const [countNewMessages, setCountNewMessages] = useState(0);

  const forceRender = useUpdate();

  const scrollToBottom = React.useCallback(
    () => chatEnd.current.scrollIntoView({ behavior: "auto" }),
    []
  );

  const isOwner = useSelector(isEventOwner);
  const userId = useSelector(getUserId);

  // handle new messages
  useEffect(() => {
    // console.log("useEffect: handle new messages");
    const currentMessagesJson = JSON.stringify(messages);
    if (currentMessagesJson !== lastTrackedMessagesJson) {
      if (isScrollAtBottom) {
        scrollToBottom();
        setCountNewMessages(0);
      } else {
        const lastMessages = JSON.parse(lastTrackedMessagesJson);
        const diff = messages.length - lastMessages.length;
        // console.log({ prev: lastMessages.length, new: messages.length, diff });
        setCountNewMessages(diff > 0 ? countNewMessages + diff : 0);
      }
      setLastTrackedMessagesJson(currentMessagesJson);
    }
  }, [
    countNewMessages,
    isScrollAtBottom,
    lastTrackedMessagesJson,
    messages,
    scrollToBottom
  ]);

  // force update of timestamps
  useEffect(() => {
    // console.log("useEffect: force update of timestamps");
    const intervalId = setInterval(() => {
      // setMessages((mess) => [...mess]);
      forceRender();
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [forceRender]);

  // initial scroll to bottom
  useEffect(() => {
    // console.log("useEffect: initial scroll to bottom");
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
    // console.log("useEffect: detect scroll changed");
    if (scrolling !== lastScrollingState) {
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

  // console.log({
  //   scrolling,
  //   isScrollAtBottom,
  //   scrollY,
  //   countNewMessages,
  //   isForcingScroll
  // });
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
                <ChatMessage
                  message={message}
                  user={user}
                  users={users}
                  isOwner={isOwner}
                  userId={userId}
                />
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
      {(!messages || messages.length === 0) && (
        <Box className={classes.emptyPane}>
          <img
            className={classes.emptyImage}
            src={NoChatMessagesImg}
            alt="Polls coming soon"
          />
          <Typography variant="body2" color="textSecondary" display="block">
            No messages sent yet. Say hi to everyone...
          </Typography>
        </Box>
      )}
    </div>
  );
};
