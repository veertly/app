import React, { useContext } from "react";
import BroadcastDialogContext from "../../../Contexts/BroadcastDialogContext";
import CreateBroadcastDialog from "./CreateBroadcastDialog";
import ConfirmationDialog from "../../Misc/ConfirmationDialog";
import {
  deleteBroadcastMessage,
  launchExistingMessage
} from "../../../Modules/broadcastOperations";

const BroadcastDialogManager = ({ sessionId, userId }) => {
  const {
    createBroadcastDialog,
    updateBroadcastDialog,
    deleteBroadcastDialog,
    launchBroadcastDialog,
    setCreateBroadcastDialog,
    setUpdateBroadcastDialog,
    setDeleteBroadcastDialog,
    setLaunchBroadcastDialog
  } = useContext(BroadcastDialogContext);

  const launchBroadcastMessage = React.useCallback(async () => {
    if (launchBroadcastDialog) {
      await launchExistingMessage({
        sessionId,
        userId,
        message: launchBroadcastDialog.message,
        originalBroadcast: launchBroadcastDialog
      });
    } else {
      throw new Error(
        "The broadcast hasn't been set correctly, please try again."
      );
    }
  }, [launchBroadcastDialog, sessionId, userId]);

  const deleteBroadcast = React.useCallback(async () => {
    if (deleteBroadcastDialog) {
      await deleteBroadcastMessage({
        sessionId,
        broadcastMessageId: deleteBroadcastDialog.id
      });
    } else {
      throw new Error(
        "The broadcast hasn't been set correctly, please try again."
      );
    }
  }, [deleteBroadcastDialog, sessionId]);

  return (
    <>
      {createBroadcastDialog && (
        <CreateBroadcastDialog
          open={!!createBroadcastDialog}
          closeDialog={() => setCreateBroadcastDialog(null)}
        ></CreateBroadcastDialog>
      )}
      {updateBroadcastDialog && (
        <CreateBroadcastDialog
          open={!!updateBroadcastDialog}
          closeDialog={() => setUpdateBroadcastDialog(null)}
          broadcastMessage={updateBroadcastDialog}
        />
      )}
      {deleteBroadcastDialog && (
        <ConfirmationDialog
          open={!!deleteBroadcastDialog}
          closeDialog={() => setDeleteBroadcastDialog(null)}
          title="Confirm deleting of this broadcast message"
          alertMessage="This broadcast message will be deleted"
          onConfirm={deleteBroadcast}
          confirmationButtonLabel="Delete Message"
        />
      )}
      {launchBroadcastDialog && (
        <ConfirmationDialog
          open={!!launchBroadcastDialog}
          closeDialog={() => setLaunchBroadcastDialog(null)}
          title="Confirm publishing of this broadcast message"
          alertMessage="This broadcast will now be published and attendees will see it on their screen"
          onConfirm={launchBroadcastMessage}
          confirmationButtonLabel="Send Broadcast"
        />
      )}
    </>
  );
};

export default BroadcastDialogManager;
