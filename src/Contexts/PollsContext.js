import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSessionId, getUserId } from "../Redux/eventSession";
import {
  useCollectionData,
  useDocumentData
} from "react-firebase-hooks/firestore";
import firebase from "../Modules/firebaseApp";
import { usePrevious } from "react-use";

// import { atomFamily } from "recoil";
import {
  POLLS_NAMESPACES,
  POLLS_STATES,
  setPollState,
  deletePoll
} from "../Modules/pollsOperations";
import _ from "lodash";
import ConfirmationDialog from "../Components/Misc/ConfirmationDialog";

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

  const [openLaunchDialogPoll, setOpenLaunchDialogPoll] = useState(null);
  const [openStopDialogPoll, setOpenStopDialogPoll] = useState(null);
  const [openDeleteDialogPoll, setOpenDeleteDialogPoll] = useState(null);

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
  const prevPollsDb = usePrevious(pollsDb);

  useEffect(() => {
    if (pollsDb && JSON.stringify(prevPollsDb) !== JSON.stringify(pollsDb)) {
      // const newMsgs = pollsDb.filter(
      //   (m) => m.status !== "ARCHIVED"
      // );
      const sortedPolls = _.reverse(pollsDb);

      setPolls((v) => ({
        ...v,
        [POLLS_NAMESPACES.GLOBAL]: sortedPolls
      }));
    }
  }, [pollsDb, prevPollsDb, sessionId]);

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
  const prevMyVotes = usePrevious(myVotesDb);

  useEffect(() => {
    if (
      myVotesDb &&
      JSON.stringify(prevMyVotes) !== JSON.stringify(myVotesDb)
    ) {
      setMyVotes((v) => ({
        ...v,
        [POLLS_NAMESPACES.GLOBAL]: myVotesDb
      }));
    }
  }, [myVotesDb, pollsDb, prevMyVotes, prevPollsDb, sessionId]);

  const setLaunchPoll = React.useCallback(async () => {
    if (openLaunchDialogPoll) {
      await setPollState(
        sessionId,
        userId,
        openLaunchDialogPoll.id,
        POLLS_STATES.PUBLISHED
      );
    } else {
      throw new Error("The poll hasn't been set correctly, please try again.");
    }
  }, [openLaunchDialogPoll, sessionId, userId]);

  const setStoppedPoll = React.useCallback(async () => {
    if (openStopDialogPoll) {
      await setPollState(
        sessionId,
        userId,
        openStopDialogPoll.id,
        POLLS_STATES.TERMINATED
      );
    } else {
      throw new Error("The poll hasn't been set correctly, please try again.");
    }
  }, [openStopDialogPoll, sessionId, userId]);

  const setDeletedPoll = React.useCallback(async () => {
    if (openDeleteDialogPoll) {
      await deletePoll(sessionId, openDeleteDialogPoll.id);
    } else {
      throw new Error("The poll hasn't been set correctly, please try again.");
    }
  }, [openDeleteDialogPoll, sessionId]);

  return (
    <PollsContext.Provider
      value={{
        polls,
        myVotes,
        setOpenLaunchDialogPoll,
        setOpenStopDialogPoll,
        setOpenDeleteDialogPoll
      }}
    >
      {openLaunchDialogPoll && (
        <ConfirmationDialog
          open={Boolean(openLaunchDialogPoll)}
          closeDialog={() => setOpenLaunchDialogPoll(null)}
          title="Confirm launching of poll"
          alertMessage="This poll will now be live and attendees can start voting"
          onConfirm={setLaunchPoll}
          confirmationButtonLabel="Launch Poll"
        />
      )}

      {openStopDialogPoll && (
        <ConfirmationDialog
          open={Boolean(openStopDialogPoll)}
          closeDialog={() => setOpenStopDialogPoll(null)}
          title="Confirm stopping of poll"
          alertMessage="This poll will now be stopped and attendees can no longer vote"
          severity="warning"
          onConfirm={setStoppedPoll}
          confirmationButtonLabel="Stop Poll"
        />
      )}

      {openDeleteDialogPoll && (
        <ConfirmationDialog
          open={Boolean(openDeleteDialogPoll)}
          closeDialog={() => setOpenDeleteDialogPoll(null)}
          title="Confirm deletion of poll"
          alertMessage="This poll will be completely deleted and can't be recovered"
          severity="error"
          onConfirm={setDeletedPoll}
          confirmationButtonLabel="Delete Poll"
        />
      )}
      {children}
    </PollsContext.Provider>
  );
};
