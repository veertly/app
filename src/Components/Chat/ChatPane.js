import React from "react";
import clsx from "clsx";
import { makeStyles /* , useTheme */ } from "@material-ui/core/styles";
// import { closeChat } from "../../Redux/actions";
import { isChatOpen } from "../../Redux/selectors";
import { useDispatch, useSelector } from "react-redux";
// import useIsMounted from "react-is-mounted-hook";
// import useEventListener from "../../Hooks/useEventListener";
import { SIDE_PANE_WIDTH } from "../../Containers/EventSession/EventSessionContainer";
import SendMessagePane from "./SendMessagePane";
import ChatMessagesPane from "./ChatMessagesPane";
import { useCollectionData } from "react-firebase-hooks/firestore";

import firebase from "../../Modules/firebaseApp";
import { sendChatMessage } from "../../Modules/chatMessagesOperations";
import { /* chatResized,  */ closeChat } from "../../Redux/actions";
import { Typography, Paper, IconButton, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { showNotificationDot, setMessageCount, getMessageCountByNS } from "../../Redux/reducers/chatMessages";

const minWidth = 150;
// const maxWidth = 800;
export const CHAT_DEFAULT_WIDTH = 350;
const CHAT_GLOBAL_NS = "global";
const LIMIT_NUM_MESSAGES_QUERY = 1000;
const CHAT_TOOLBAR_HEIGHT = 37;

const useStyles = makeStyles((theme) => ({
  chatPane: {
    position: "absolute",
    top: 64,
    right: SIDE_PANE_WIDTH,
    bottom: 0,
    // backgroundColor: "rgba(27, 71, 98, 0.4)",
    backgroundColor: "white",
    minWidth,
    width: CHAT_DEFAULT_WIDTH,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
  },
  chatBackground: {
    backgroundColor: "rgba(27, 71, 98, 0.1)",
    // padding: theme.spacing(1),
    height: "100%",
  },
  dragger: {
    width: "1px",
    // cursor: "ew-resize",
    padding: "4px 0 0",
    borderTop: "0px solid #ddd",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: "100",
    backgroundColor: "rgba(27, 71, 98, 0.5)",
  },
  hide: {
    display: "none",
  },
  messagesPane: {
    position: "absolute",
    bottom: 50,
    right: 0,
    left: 0,
    top: CHAT_TOOLBAR_HEIGHT,
  },
  sendMessagePane: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: 50,
  },
  toolbar: {
    width: "100%",
    padding: theme.spacing(1, 2),
    backgroundColor: "white",
    height: CHAT_TOOLBAR_HEIGHT,
    display: "flex",
  },
}));

export default function ChatPane(props) {
  const { eventSession, user, users /* onResize */ } = props;
  const classes = useStyles();
  // const theme = useTheme();
  const dispatch = useDispatch();
  // const mounted = useIsMounted();

  // const isOwner = React.useMemo(() => eventSession && user && eventSession.owner === user.uid, [eventSession, user]);
  const chatOpen = useSelector(isChatOpen);
  const messageCountActual = useSelector(getMessageCountByNS(eventSession.id));

  // const handleCloseChat = React.useCallback(() => dispatch(closeChat()), [dispatch]);
  // const openDetails = React.useCallback(() => dispatch(openEventDetails()), [dispatch]);
  const [draggerState /* setDraggerState */] = React.useState({
    mobileOpen: false,
    isResizing: false,
    lastDownX: 0,
    newWidth: {},
  });

  // const handleMousemove = React.useCallback(
  //   (e) => {
  //     // we don't want to do anything if we aren't resizing.
  //     if (!draggerState.isResizing || !mounted) {
  //       return;
  //     }

  //     let offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft) - SIDE_PANE_WIDTH;
  //     if (offsetRight > minWidth && offsetRight < maxWidth) {
  //       setDraggerState({ ...draggerState, newWidth: { width: offsetRight } });
  //       dispatch(chatResized(offsetRight));
  //       onResize(offsetRight);
  //     }
  //   },
  //   [draggerState, mounted, onResize, dispatch]
  // );

  // const handleMousedown = (e) => {
  //   setDraggerState({ ...draggerState, isResizing: true, lastDownX: e.clientX });
  // };

  // const handleMouseup = (e) => {
  //   if (mounted) {
  //     setDraggerState({ ...draggerState, isResizing: false });
  //   }
  // };

  // useEventListener("mousemove", handleMousemove);
  // useEventListener("mouseup", handleMouseup);

  const [messagesFirebase /* , loadingMessages, errorMessages */] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessionsChatMessages")
      .doc(eventSession.id)
      .collection(CHAT_GLOBAL_NS)
      .orderBy("sentDate", "desc")
      .limit(LIMIT_NUM_MESSAGES_QUERY)
  );

  if (messagesFirebase){
    if (messageCountActual && messageCountActual!== 0 && messageCountActual < messagesFirebase.length) {
      if (!chatOpen) {
        dispatch(showNotificationDot());
      } 
      dispatch(setMessageCount(eventSession.id, messagesFirebase.length));
    } else if((!messageCountActual || messageCountActual === 0) && messagesFirebase.length > 0) {
      dispatch(setMessageCount(eventSession.id, messagesFirebase.length));
    }
  }

  const handleMessageSend = async (message) => {
    if (message && message.trim() !== "") {
      let timestamp = new Date().getTime();

      let messageId = "" + timestamp + "-" + user.uid;
      await sendChatMessage(eventSession, user.uid, CHAT_GLOBAL_NS, messageId, message);
    }
  };
  // React.useEffect(() => {
  //   console.log("---> on did mount");
  //   letdocument.addEventListener("mousemove", (e) => handleMousemove(e));
  //   document.addEventListener("mouseup", (e) => handleMouseup(e));
  //   //TODO: understand well the flow and remove this disable instruction of eslint
  // }, [handleMousemove, handleMouseup]);

  return (
    <div
      className={clsx(classes.chatPane, {
        [classes.hide]: !chatOpen,
      })}
      style={draggerState.newWidth}
    >
      <div className={classes.chatBackground}>
        {/* https://stackblitz.com/edit/react-2h1g6x?file=ResponsiveDrawer.js */}
        <div
          id="dragger"
          // onMouseDown={(event) => {
          //   handleMousedown(event);
          // }}
          className={classes.dragger}
        />
        <Paper className={classes.toolbar} elevation={1}>
          <Typography variant="button" className={classes.title} align="center" color="primary">
            CHAT
          </Typography>
          <div style={{ flexGrow: 1 }}></div>
          <Tooltip title="Close chat">
            <IconButton
              aria-label="delete"
              className={classes.margin}
              size="small"
              color="primary"
              onClick={() => dispatch(closeChat())}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Paper>
        <div className={classes.messagesPane}>
          <ChatMessagesPane eventSession={eventSession} messages={messagesFirebase} users={users} user={user} />
        </div>
        <div className={classes.sendMessagePane}>
          <SendMessagePane onMessageSendClicked={handleMessageSend} />
        </div>
      </div>
    </div>
  );
}
