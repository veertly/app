import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getSessionId } from "../Redux/eventSession";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "../Modules/firebaseApp";

export const CHAT_GLOBAL_NS = "global";
const LIMIT_NUM_MESSAGES_QUERY = 500;

const initialContext = {
  chatMessages: { [CHAT_GLOBAL_NS]: [] },
  setChatMessages: (namespace, messages) => {}
};

const ChatMessagesContext = React.createContext(initialContext);

export default ChatMessagesContext;

export const ChatMessagesContextWrapper = ({ children }) => {
  const [chatMessages, setChatMessages] = React.useState(
    initialContext.chatMessages
  );

  const sessionId = useSelector(getSessionId);

  // --- global chat ---
  const [
    globalChatMessagesDb /* , loadingMessages, errorMessages */
  ] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessionsChatMessages")
      .doc(sessionId)
      .collection(CHAT_GLOBAL_NS)
      .orderBy("sentDate", "desc")
      .limit(LIMIT_NUM_MESSAGES_QUERY)
  );

  useEffect(() => {
    if (globalChatMessagesDb) {
      console.log("--> Updated chat: " + globalChatMessagesDb.length);
      setChatMessages((v) => ({
        ...v,
        [CHAT_GLOBAL_NS]: globalChatMessagesDb
      }));
    }
  }, [globalChatMessagesDb, sessionId]);

  return (
    <ChatMessagesContext.Provider
      value={{
        chatMessages,
        setChatMessages
      }}
    >
      {children}
    </ChatMessagesContext.Provider>
  );
};
