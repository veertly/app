import React, { useState } from "react";
import { BroadcastDialogProvider } from "./BroadcastDialogContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BROADCAST_MESSAGE_NAMESPACES } from "../Modules/broadcastOperations";
import firebase from "../Modules/firebaseApp";
import { useSelector } from "react-redux";
import { getSessionId } from "../Redux/eventSession";
import moment from "moment";

const initialContext = {
  broadcastMessages: [],
  activeBroadcastMessage: null
};

const BroadcastMessagesContext = React.createContext(initialContext);

export const BroadcastMessagesProvider = ({ children }) => {
  const [broadcastMessages, setBroadcastMessages] = useState(
    initialContext.broadcastMessages
  );
  const sessionId = useSelector(getSessionId);
  const [activeBroadcastMessage, setActiveBroadcastMessage] = useState(null);

  const [broadcastMessagesDb /* loading, error */] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("broadcasts")
      .doc(BROADCAST_MESSAGE_NAMESPACES.GLOBAL)
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
    const activeMessages = broadcastMessages
      ? broadcastMessages.filter((message) => {
          // console.log(moment().diff(moment(message.creationDate)), moment(message.creationDate.seconds * 1000).calendar(), message.creationDate);
          // console.log(message.creationDate);
          if (!message.creationDate) {
            return false;
          }
          const timeDiffInMillis = moment().diff(
            moment(message.creationDate.seconds * 1000)
          );
          // console.log(moment().diff(moment(message.creationDate)) < message.selfDestructTime);
          if (timeDiffInMillis < message.selfDestructTime) {
            return true;
          }
          return false;
        })
      : null;
    // console.log(activeMessages);
    let timeoutId;
    if (activeMessages && activeMessages[0]) {
      setActiveBroadcastMessage(activeMessages[0]);
      timeoutId = setTimeout(() => {
        setActiveBroadcastMessage(null);
      }, activeMessages[0].selfDestructTime);
    } else {
      setActiveBroadcastMessage(null);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [broadcastMessages]);

  return (
    <BroadcastMessagesContext.Provider
      value={{
        broadcastMessages,
        activeBroadcastMessage
      }}
    >
      <BroadcastDialogProvider>{children}</BroadcastDialogProvider>
    </BroadcastMessagesContext.Provider>
  );
};

export default BroadcastMessagesContext;
