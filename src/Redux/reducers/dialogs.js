import { OPEN_EDIT_PROFILE, CLOSE_EDIT_PROFILE, OPEN_EVENT_DETAILS, CLOSE_EVENT_DETAILS } from "../actionTypes";

const initialState = {
  editProfileOpen: false,
  eventDetailsOpen: false,
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
    default:
      return state;
  }
}
