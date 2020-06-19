import React from "react";
import ChatDraftMessageContext from "../Contexts/ChatDraftMessageContext";

const ChatDraftMessageProvider = ({ ...props }) => {
  const [message, setMessage] = React.useState("");

  return (
    <ChatDraftMessageContext.Provider
      value={{
        message,
        setMessage
      }}
      { ...props }
     />
  )
};

export default ChatDraftMessageProvider;
