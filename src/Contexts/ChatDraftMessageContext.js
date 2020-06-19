import React from "react";

const ChatDraftMessageContext = React.createContext({
  message: "",
  setMessage: () => {},
});

export default ChatDraftMessageContext;
