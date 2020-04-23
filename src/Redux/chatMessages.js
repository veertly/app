const initialState = {
  pendingMessages: [],
  showNotificationDot: false,
  messageCount: {
  },
};

const getAppendedNS = (sessionId) => `CHAT_GLOBAL_${sessionId}`;

// action types
export const SET_NOTIFICATION_DOT = "CHAT/SET_NOTIFICATION_DOT";
export const SET_MESSAGE_COUNT = "CHAT/SET_MESSAGE_COUNT";

// action creator
export const showNotificationDot = () => ({
  type: SET_NOTIFICATION_DOT,
  showNotificationDot: true,
});

export const hideNotificationDot = () => ({
  type: SET_NOTIFICATION_DOT,
  showNotificationDot: false,
});

export const setMessageCount = (sessionId, messageCount) => ({
  type: SET_MESSAGE_COUNT,
  sessionId: getAppendedNS(sessionId),
  messageCount: messageCount
})

export default function chatMessagesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATION_DOT: {
      return {
        ...state,
        showNotificationDot: action.showNotificationDot,
      }
    }
    case SET_MESSAGE_COUNT: {
      return {
        ...state,
        messageCount: {
          ...state.messageCount,
          [action.sessionId]: action.messageCount,
        },
      }
    }
    default:
      return state;
  }
}

// selectors
export const toShowNotificationDot = (state) => state.chat.showNotificationDot;
export const getMessageCount = (state) => state.chat.messageCount;
export const getMessageCountByNS = (sessionId) => (state) => state.chat.messageCount[getAppendedNS(sessionId)];