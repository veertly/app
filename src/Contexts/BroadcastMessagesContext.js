import React, { useState } from "react";
import { BROADCAST_MESSAGE_STATES } from "../Modules/broadcastOperations";
import { BroadcastDialogProvider } from "./BroadcastDialogContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { POLLS_NAMESPACES } from "../Modules/pollsOperations";
import firebase from "../Modules/firebaseApp";
import { useSelector } from "react-redux";
import { getSessionId } from "../Redux/eventSession";

const initialContext = {
  broadcastMessages: [],
  activeBroadcastMessage: null,
};

const BroadcastMessagesContext = React.createContext(initialContext);

export const BroadcastMessagesProvider = ({ children }) => {
  const [broadcastMessages, setBroadcastMessages] = useState(initialContext.broadcastMessages);
  const sessionId = useSelector(getSessionId);
  const [activeBroadcastMessage, setActiveBroadcastMessage] = useState(null);

  const [broadcastMessagesDb /* loading, error */] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("broadcasts")
      .doc(POLLS_NAMESPACES.GLOBAL)
      .collection("broadcastsMessages")
    // .where("isArchived", "==", false)
    // .orderBy("sentDate", "desc")
    // .limit(LIMIT_NUM_MESSAGES_QUERY + 
  );

  // const prevBroadcastMessagesDb = usePrevious(broadcastMessagesDb);

  React.useEffect(() => {
    setBroadcastMessages(broadcastMessagesDb);
  }, [broadcastMessagesDb]);

  React.useEffect(() => {
    const activeMessages = broadcastMessages ? broadcastMessages.filter(message => message.state === BROADCAST_MESSAGE_STATES.ACTIVE) : null;
    if (activeMessages && activeMessages[0]) {
      setActiveBroadcastMessage(activeMessages[0]);
    } else {
      setActiveBroadcastMessage(null);
    }
  }, [broadcastMessages])

  return (
    <BroadcastMessagesContext.Provider
      value={{
        broadcastMessages,
        activeBroadcastMessage,
      }}
    >
      <BroadcastDialogProvider>
        {children}
      </BroadcastDialogProvider>
    </BroadcastMessagesContext.Provider>
  )
}

export default BroadcastMessagesContext;