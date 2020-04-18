import { CHAT_DEFAULT_WIDTH } from "../Components/Chat/ChatPane";

const OPEN_EDIT_PROFILE = "dialogs.OPEN_EDIT_PROFILE";
const CLOSE_EDIT_PROFILE = "dialogs.CLOSE_EDIT_PROFILE";
const OPEN_EVENT_DETAILS = "dialogs.OPEN_EVENT_DETAILS";
const CLOSE_EVENT_DETAILS = "dialogs.CLOSE_EVENT_DETAILS";
const OPEN_CHAT = "dialogs.OPEN_CHAT";
const CLOSE_CHAT = "dialogs.CLOSE_CHAT";
const CHAT_RESIZED = "dialogs.CHAT_RESIZED";
const OPEN_SHARE = "dialogs.OPEN_SHARE";
const CLOSE_SHARE = "dialogs.CLOSE_SHARE";
const OPEN_FEEDBACK = "dialogs.OPEN_FEEDBACK";
const CLOSE_FEEDBACK = "dialogs.CLOSE_FEEDBACK";

const initialState = {
  editProfileOpen: false,
  eventDetailsOpen: false,
  chatOpen: false,
  chatWidth: CHAT_DEFAULT_WIDTH,
  shareOpen: false,
  feedbackOpen: false,
};

export const dialogsReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_EDIT_PROFILE: {
      return {
        ...state,
        editProfileOpen: true,
      };
    }
    case CLOSE_EDIT_PROFILE: {
      return {
        ...state,
        editProfileOpen: false,
      };
    }

    case OPEN_EVENT_DETAILS: {
      return {
        ...state,
        eventDetailsOpen: true,
      };
    }
    case CLOSE_EVENT_DETAILS: {
      return {
        ...state,
        eventDetailsOpen: false,
      };
    }

    case OPEN_CHAT: {
      return {
        ...state,
        chatOpen: true,
      };
    }
    case CLOSE_CHAT: {
      return {
        ...state,
        chatOpen: false,
      };
    }
    case CHAT_RESIZED: {
      return {
        ...state,
        chatWidt: action.newWidth,
      };
    }
    case OPEN_SHARE: {
      return {
        ...state,
        shareOpen: true,
      };
    }
    case CLOSE_SHARE: {
      return {
        ...state,
        shareOpen: false,
      };
    }

    case OPEN_FEEDBACK: {
      return {
        ...state,
        feedbackOpen: true,
      };
    }
    case CLOSE_FEEDBACK: {
      return {
        ...state,
        feedbackOpen: false,
      };
    }
    default:
      return state;
  }
};

export const isEditProfileOpen = (store) => store.dialogs.editProfileOpen === true;

export const isEventDetailsOpen = (store) => store.dialogs.eventDetailsOpen === true;

export const isChatOpen = (store) => store.dialogs.chatOpen === true;

export const chatWidth = (store) => store.dialogs.chatWidth;

export const isShareOpen = (store) => store.dialogs.shareOpen === true;

export const isFeedbackOpen = (store) => store.dialogs.feedbackOpen === true;

export const openEditProfile = () => ({
  type: OPEN_EDIT_PROFILE,
});

export const closeEditProfile = () => ({
  type: CLOSE_EDIT_PROFILE,
});

export const openEventDetails = () => ({
  type: OPEN_EVENT_DETAILS,
});

export const closeEventDetails = () => ({
  type: CLOSE_EVENT_DETAILS,
});

export const closeChat = () => ({
  type: CLOSE_CHAT,
});

export const openChat = () => ({
  type: OPEN_CHAT,
});
export const chatResized = (newWidth) => ({
  type: CHAT_RESIZED,
  newWidth,
});

export const openShare = () => ({
  type: OPEN_SHARE,
});

export const closeShare = () => ({
  type: CLOSE_SHARE,
});

export const openFeedback = () => ({
  type: OPEN_FEEDBACK,
});

export const closeFeedback = () => ({
  type: CLOSE_FEEDBACK,
});
