import React, { useContext } from "react";
import BroadcastMessagesContext from "../../Contexts/BroadcastMessagesContext";
import { useSelector } from "react-redux";
import { isEventOwner } from "../../Redux/eventSession";

const ParticipantBroadcastDialogContainer = () => {
  const {
    activeBroadcastMessage
  } = useContext(BroadcastMessagesContext);
  
  const isOwner = useSelector(isEventOwner);

  if (activeBroadcastMessage && !isOwner) {
    console.log("show Dialog");
    return null;
  };
  console.log("no active dialog")
  return (
    <>
    </>
  );
};

export default ParticipantBroadcastDialogContainer;
