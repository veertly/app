import React, { useContext } from "react";
import BroadcastDialogContext from "../../../Contexts/BroadcastDialogContext";
import CreateBroadcastDialog from "./CreateBroadcastDialog";
import ConfirmationDialog from "../../Misc/ConfirmationDialog";
import { deleteBroadcastMessage, launchBroadcastMessage as launchBroadcastMessageDb } from "../../../Modules/broadcastOperations";

const BroadcastDialogManager = ({ sessionId, userId }) => {

  const {
    createBroadcastDialog,
    updateBroadcastDialog,
    deleteBroadcastDialog,
    launchBroadcastDialog,
    setCreateBroadcastDialog,
    setUpdateBroadcastDialog,
    setDeleteBroadcastDialog,
    setLaunchBroadcastDialog,
  } = useContext(BroadcastDialogContext);

  const launchBroadcastMessage = React.useCallback(async () => {
    if (launchBroadcastDialog) {
      // await setBroadcastState({
      //   sessionId,
      //   userId,
      //   originalBroadcast: launchBroadcastDialog,
      //   newState: BROADCAST_MESSAGE_STATES.PUBLISHED
      // });
      await launchBroadcastMessageDb({
        sessionId,
        userId,
        message: launchBroadcastDialog.message
      })
    } else {
      throw new Error("The poll hasn't been set correctly, please try again.");
    }
  }, [launchBroadcastDialog, sessionId, userId]);

  const deletePoll = React.useCallback(async () => {
    if (deleteBroadcastDialog) {
      await deleteBroadcastMessage({
        sessionId,
        broadcastMessageId: deleteBroadcastDialog.id
      });
    } else {
      throw new Error("The poll hasn't been set correctly, please try again.");
    }
  }, [deleteBroadcastDialog, sessionId]);


  return (
    <>
      {createBroadcastDialog && 
        <CreateBroadcastDialog
          open={!!createBroadcastDialog}
          closeDialog={() => setCreateBroadcastDialog(null)}
        >
        </CreateBroadcastDialog>
      }
      {
        updateBroadcastDialog && (
          <CreateBroadcastDialog 
            open={!!updateBroadcastDialog}
            closeDialog={() => setUpdateBroadcastDialog(null)}
            broadcastMessage={updateBroadcastDialog}
          />
        )
      }
      {
        deleteBroadcastDialog && (
          <ConfirmationDialog
            open={!!deleteBroadcastDialog}
            closeDialog={() => setDeleteBroadcastDialog(null)}
            title="Confirm deleting of this message"
            alertMessage="This poll will now be live and attendees can start voting"
            onConfirm={deletePoll}
            confirmationButtonLabel="Delete Message"
          />
        )
      }
      {
        launchBroadcastDialog && (
          <ConfirmationDialog
            open={!!launchBroadcastDialog}
            closeDialog={() => setLaunchBroadcastDialog(null)}
            title="Confirm launching of this message"
            alertMessage="This poll will now be live and attendees can start voting"
            onConfirm={launchBroadcastMessage}
            confirmationButtonLabel="Launch Poll"
          />
        )
      }
    </>
  )
}

export default BroadcastDialogManager;