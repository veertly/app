import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getSessionId, getUserId } from "../Redux/eventSession";

// import { atomFamily } from "recoil";
import {
  POLLS_STATES,
  setPollState,
  deletePoll
} from "../Modules/pollsOperations";
import ConfirmationDialog from "../Components/Misc/ConfirmationDialog";
import { CreatePollDialog } from "../Components/EventSession/Polls/CreatePollDialog";

const initialContext = {
  setOpenCreateDialogPoll: () => {},
  setOpenUpdateDialogPoll: () => {},
  setOpenLaunchDialogPoll: () => {},
  setOpenStopDialogPoll: () => {},
  setOpenDeleteDialogPoll: () => {}
};

const PollsDialogsContext = React.createContext(initialContext);

export default PollsDialogsContext;

export const PollsDialogsContextWrapper = ({ children }) => {
  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);

  const [openCreateDialogPoll, setOpenCreateDialogPoll] = useState(false);
  const [openUpdateDialogPoll, setOpenUpdateDialogPoll] = useState(null);
  const [openLaunchDialogPoll, setOpenLaunchDialogPoll] = useState(null);
  const [openStopDialogPoll, setOpenStopDialogPoll] = useState(null);
  const [openDeleteDialogPoll, setOpenDeleteDialogPoll] = useState(null);

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
    <PollsDialogsContext.Provider
      value={{
        setOpenCreateDialogPoll,
        setOpenUpdateDialogPoll,
        setOpenLaunchDialogPoll,
        setOpenStopDialogPoll,
        setOpenDeleteDialogPoll
      }}
    >
      {openCreateDialogPoll && (
        <CreatePollDialog
          open={openCreateDialogPoll}
          setOpen={setOpenCreateDialogPoll}
        />
      )}

      {openUpdateDialogPoll && (
        <CreatePollDialog
          open={Boolean(openUpdateDialogPoll)}
          setOpen={setOpenUpdateDialogPoll}
          poll={openUpdateDialogPoll}
        />
      )}

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
    </PollsDialogsContext.Provider>
  );
};
