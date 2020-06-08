import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getSessionId } from "../Redux/eventSession";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "../Modules/firebaseApp";
import ChatArchiveDialog from "../Components/Chat/ChatArchiveDialog";
import { usePrevious } from "react-use";

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

  const [
    chatArchiveDialogMessage,
    setChatArchiveDialogMessage
  ] = React.useState(null);

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
      // .where("isArchived", "==", false)
      .orderBy("sentDate", "desc")
      .limit(LIMIT_NUM_MESSAGES_QUERY)
  );

  const prevGlobalChatMessagesDb = usePrevious(globalChatMessagesDb);

  useEffect(() => {
    if (
      globalChatMessagesDb &&
      JSON.stringify(prevGlobalChatMessagesDb) !==
        JSON.stringify(globalChatMessagesDb)
    ) {
      const newMsgs = globalChatMessagesDb.filter(
        (m) => m.status !== "ARCHIVED"
      );

      setChatMessages((v) => ({
        ...v,
        [CHAT_GLOBAL_NS]: newMsgs
      }));
    }
  }, [globalChatMessagesDb, prevGlobalChatMessagesDb, sessionId]);

  return (
    <ChatMessagesContext.Provider
      value={{
        chatMessages,
        setChatMessages,
        setChatArchiveDialogMessage
      }}
    >
      <ChatArchiveDialog
        open={!!chatArchiveDialogMessage}
        closeDialog={() => setChatArchiveDialogMessage(null)}
        message={chatArchiveDialogMessage}
      />
      {children}
    </ChatMessagesContext.Provider>
  );
};
