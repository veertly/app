import React, { useMemo } from "react";
import { makeStyles /* , useTheme */ } from "@material-ui/core/styles";
import SendMessagePane from "./SendMessagePane";
import ChatMessagesPane from "./ChatMessagesPane";
import { sendChatMessage } from "../../Modules/chatMessagesOperations";

import { useSelector, shallowEqual } from "react-redux";
import {
  getUsers,
  getUser,
  getSessionId,
  getUserId
} from "../../Redux/eventSession";
import ChatMessagesContext, {
  CHAT_GLOBAL_NS
} from "../../Contexts/ChatMessagesContext";

const CHAT_TOOLBAR_HEIGHT = 37;

const useStyles = makeStyles((theme) => ({
  messagesPane: {
    position: "absolute",
    bottom: 50,
    right: 0,
    left: 0,
    top: CHAT_TOOLBAR_HEIGHT
  },
  sendMessagePane: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: 50
  }
}));

export default function ChatPane(props) {
  const classes = useStyles();
  const sessionId = useSelector(getSessionId);
  const users = useSelector(getUsers, shallowEqual);
  const userId = useSelector(getUserId);
  const user = useSelector(getUser, shallowEqual);

  const { chatMessages } = React.useContext(ChatMessagesContext);

  const globalChatMessages = useMemo(() => chatMessages[CHAT_GLOBAL_NS], [
    chatMessages
  ]);

  const handleMessageSend = async (message) => {
    if (message && message.trim() !== "") {
      let timestamp = new Date().getTime();

      let messageId = "" + timestamp + "-" + userId;
      //TODO: add user (avatar, name) to the message
      await sendChatMessage(
        sessionId,
        user.id,
        CHAT_GLOBAL_NS,
        messageId,
        message
      );
    }
  };

  return (
    <div>
      <div className={classes.messagesPane}>
        <ChatMessagesPane messages={globalChatMessages} users={users} />
      </div>
      <div className={classes.sendMessagePane}>
        <SendMessagePane onMessageSendClicked={handleMessageSend} />
      </div>
    </div>
  );
}
