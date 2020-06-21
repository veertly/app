import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getSessionId, getUserId } from "../Redux/eventSession";
import {
  useCollectionData,
  useDocumentData
} from "react-firebase-hooks/firestore";
import firebase from "../Modules/firebaseApp";

// import { atomFamily } from "recoil";
import { POLLS_NAMESPACES } from "../Modules/pollsOperations";
import _ from "lodash";
import { PollsDialogsContextWrapper } from "./PollsDialogsContext";

const initialContext = {
  polls: { [POLLS_NAMESPACES.GLOBAL]: [] },
  myVotes: { [POLLS_NAMESPACES.GLOBAL]: [] }
};

const PollsContext = React.createContext(initialContext);

export default PollsContext;

// const poolForId = atomFamily({
//   key: "poolItem",
//   default: {
//     id: "",
//     owner: "",
//     creationDate: firebase.firestore.Timestamp.fromDate(new Date()),
//     title: "",
//     options: [],
//     votesCounter: {},
//     checkedAnonymous: true,
//     checkedNotification: false,
//     state: POLLS_STATES.PUBLISHED
//   }
// });

export const PollsContextWrapper = ({ children }) => {
  const [polls, setPolls] = React.useState(initialContext.polls);
  const [myVotes, setMyVotes] = React.useState(initialContext.myVotes);

  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);

  const [pollsDb /* loading, error */] = useCollectionData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("polls")
      .doc(POLLS_NAMESPACES.GLOBAL)
      .collection("polls")
    // .where("isArchived", "==", false)
    // .orderBy("sentDate", "desc")
    // .limit(LIMIT_NUM_MESSAGES_QUERY)
  );
  // const prevPollsDb = usePrevious(pollsDb);

  useEffect(() => {
    if (pollsDb) {
      const sortedPolls = _.reverse(pollsDb);
      setPolls((v) => ({
        ...v,
        [POLLS_NAMESPACES.GLOBAL]: sortedPolls
      }));
    }
  }, [pollsDb, sessionId]);

  const [myVotesDb /* loading, error */] = useDocumentData(
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("polls")
      .doc(POLLS_NAMESPACES.GLOBAL)
      .collection("userVotes")
      .doc(userId)
  );
  // const prevMyVotes = usePrevious(myVotesDb);

  useEffect(() => {
    if (myVotesDb) {
      setMyVotes((v) => ({
        ...v,
        [POLLS_NAMESPACES.GLOBAL]: myVotesDb
      }));
    }
  }, [myVotesDb, pollsDb, sessionId]);

  return (
    <PollsContext.Provider
      value={{
        polls,
        myVotes
      }}
    >
      <PollsDialogsContextWrapper>{children}</PollsDialogsContextWrapper>
    </PollsContext.Provider>
  );
};
