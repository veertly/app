import React, { useState } from "react";

const BroadcastDialogContext = React.createContext({
  createBroadcastDialog: null,
  setCreateBroadcastDialog: () => {},
  updateBroadcastDialog: null,
  setUpdateBroadcastDialog: () => {},
  deleteBroadcastDialog: null,
  setDeleteBroadcastDialog: () => {},
  launchBroadcastDialog: null,
  setLaunchBroadcastDialog: () => {}
});

export const BroadcastDialogProvider = ({ children }) => {
  const [createBroadcastDialog, setCreateBroadcastDialog] = useState(null);
  const [updateBroadcastDialog, setUpdateBroadcastDialog] = useState(null);
  const [deleteBroadcastDialog, setDeleteBroadcastDialog] = useState(null);
  const [launchBroadcastDialog, setLaunchBroadcastDialog] = useState(null)
  return (
    <BroadcastDialogContext.Provider
      value={{
        createBroadcastDialog,
        setCreateBroadcastDialog,
        updateBroadcastDialog,
        setUpdateBroadcastDialog,
        deleteBroadcastDialog,
        setDeleteBroadcastDialog,
        launchBroadcastDialog,
        setLaunchBroadcastDialog,
      }}
    >
      {children}
    </BroadcastDialogContext.Provider>
  );
};

export default BroadcastDialogContext;
