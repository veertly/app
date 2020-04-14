import { SEND_CHAT_MESSAGE, CHAT_MESSAGE_SENT } from "../actionTypes";
import _ from "lodash";

const initialState = {
  pendingMessages: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SEND_CHAT_MESSAGE: {
      let newPendingMessages = pendingMessages;
      pendingMessages.push(action.message);
      return {
        ...state,
        pendingMessages: newPendingMessages,
      };
    }
    case CHAT_MESSAGE_SENT: {
      let newPendingMessages = _.remove(pendingMessages, (message) => message.key === action.messageKey);
      return {
        ...state,
        pendingMessages: newPendingMessages,
      };
    }
    default:
      return state;
  }
}
