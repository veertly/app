import {
  OPEN_EDIT_PROFILE,
  CLOSE_EDIT_PROFILE,
  OPEN_EVENT_DETAILS,
  CLOSE_EVENT_DETAILS,
  OPEN_CHAT,
  CLOSE_CHAT,
} from "../actionTypes";

const initialState = {
  editProfileOpen: false,
  eventDetailsOpen: false,
  chatOpen: true,
};

export default function (state = initialState, action) {
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
    default:
      return state;
  }
}
