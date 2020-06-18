const OPEN_EDIT_PROFILE = "dialogs.OPEN_EDIT_PROFILE";
const CLOSE_EDIT_PROFILE = "dialogs.CLOSE_EDIT_PROFILE";
const OPEN_EVENT_DETAILS = "dialogs.OPEN_EVENT_DETAILS";
const CLOSE_EVENT_DETAILS = "dialogs.CLOSE_EVENT_DETAILS";
const OPEN_SHARE = "dialogs.OPEN_SHARE";
const CLOSE_SHARE = "dialogs.CLOSE_SHARE";
const OPEN_FEEDBACK = "dialogs.OPEN_FEEDBACK";
const CLOSE_FEEDBACK = "dialogs.CLOSE_FEEDBACK";
const OPEN_JOIN_PARTICIPANT = "dialogs.OPEN_JOIN_PARTICIPANT";
const CLOSE_JOIN_PARTICIPANT = "dialogs.CLOSE_JOIN_PARTICIPANT";

const OPEN_CREATE_ROOM = "dialogs.OPEN_CREATE_ROOM";
const CLOSE_CREATE_ROOM = "dialogs.CLOSE_CREATE_ROOM";
const OPEN_EDIT_ROOM = "dialogs.OPEN_EDIT_ROOM";

const OPEN_JOIN_ROOM = "dialogs.OPEN_JOIN_ROOM";
const CLOSE_JOIN_ROOM = "dialogs.CLOSE_JOIN_ROOM";

const OPEN_ROOM_ARCHIVED = "dialogs.OPEN_ROOM_ARCHIVED";
const CLOSE_ROOM_ARCHIVED = "dialogs.CLOSE_ROOM_ARCHIVED";

const OPEN_ROOM_REORDER = "dialogs.OPEN_ROOM_REORDER";
const CLOSE_ROOM_REORDER = "dialogs.CLOSE_ROOM_REORDER";

const initialState = {
  editProfileOpen: false,
  eventDetailsOpen: false,
  shareOpen: false,
  feedbackOpen: false,
  joinParticipantOpen: false,
  joinParticipantEntity: null,
  createRoomOpen: false,
  editRoomEntity: null,
  joinRoomOpen: false,
  joinRoomEntity: null,
  roomArchivedOpen: false,
  roomArchivedEntity: null,
  roomsReorderOpen: false
};

export const dialogsReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_EDIT_PROFILE: {
      return {
        ...state,
        editProfileOpen: true
      };
    }
    case CLOSE_EDIT_PROFILE: {
      return {
        ...state,
        editProfileOpen: false
      };
    }

    case OPEN_EVENT_DETAILS: {
      return {
        ...state,
        eventDetailsOpen: true
      };
    }
    case CLOSE_EVENT_DETAILS: {
      return {
        ...state,
        eventDetailsOpen: false
      };
    }

    case OPEN_SHARE: {
      return {
        ...state,
        shareOpen: true
      };
    }
    case CLOSE_SHARE: {
      return {
        ...state,
        shareOpen: false
      };
    }

    case OPEN_FEEDBACK: {
      return {
        ...state,
        feedbackOpen: true
      };
    }
    case CLOSE_FEEDBACK: {
      return {
        ...state,
        feedbackOpen: false
      };
    }

    case OPEN_JOIN_PARTICIPANT: {
      return {
        ...state,
        joinParticipantOpen: true,
        joinParticipantEntity: action.participant
      };
    }
    case CLOSE_JOIN_PARTICIPANT: {
      return {
        ...state,
        joinParticipantOpen: false,
        joinParticipantEntity: null
      };
    }

    case OPEN_CREATE_ROOM: {
      return {
        ...state,
        createRoomOpen: true
      };
    }
    case CLOSE_CREATE_ROOM: {
      return {
        ...state,
        createRoomOpen: false,
        editRoomEntity: null
      };
    }
    case OPEN_EDIT_ROOM: {
      return {
        ...state,
        createRoomOpen: true,
        editRoomEntity: action.room
      };
    }

    case OPEN_JOIN_ROOM: {
      return {
        ...state,
        joinRoomOpen: true,
        joinRoomEntity: action.room
      };
    }
    case CLOSE_JOIN_ROOM: {
      return {
        ...state,
        joinRoomOpen: false,
        joinRoomEntity: null
      };
    }

    case OPEN_ROOM_ARCHIVED: {
      return {
        ...state,
        roomArchivedOpen: true,
        roomArchivedEntity: action.room
      };
    }
    case CLOSE_ROOM_ARCHIVED: {
      return {
        ...state,
        roomArchivedOpen: false,
        roomArchivedEntity: null
      };
    }
    case OPEN_ROOM_REORDER: {
      return {
        ...state,
        roomReorderOpen: true
      };
    }
    case CLOSE_ROOM_REORDER: {
      return {
        ...state,
        roomReorderOpen: false
      };
    }

    default:
      return state;
  }
};

export const isEditProfileOpen = (store) =>
  store.dialogs.editProfileOpen === true;

export const isEventDetailsOpen = (store) =>
  store.dialogs.eventDetailsOpen === true;

export const isShareOpen = (store) => store.dialogs.shareOpen === true;

export const isFeedbackOpen = (store) => store.dialogs.feedbackOpen === true;

export const isJoinParticipantOpen = (store) =>
  store.dialogs.joinParticipantOpen === true;

export const getJoinParticipantEntity = (store) =>
  store.dialogs.joinParticipantEntity;

export const isCreateRoomOpen = (store) =>
  store.dialogs.createRoomOpen === true;
export const getEditRoomEntity = (store) => store.dialogs.editRoomEntity;
export const isJoinRoomOpen = (store) => store.dialogs.joinRoomOpen === true;

export const getJoinRoomEntity = (store) => store.dialogs.joinRoomEntity;

export const isRoomArchivedOpen = (store) =>
  store.dialogs.roomArchivedOpen === true;

export const getRoomArchivedEntity = (store) =>
  store.dialogs.roomArchivedEntity;

export const isRoomReorderOpen = (store) =>
  store.dialogs.roomReorderOpen === true;

export const openEditProfile = () => ({
  type: OPEN_EDIT_PROFILE
});

export const closeEditProfile = () => ({
  type: CLOSE_EDIT_PROFILE
});

export const openEventDetails = () => ({
  type: OPEN_EVENT_DETAILS
});

export const closeEventDetails = () => ({
  type: CLOSE_EVENT_DETAILS
});

export const openShare = () => ({
  type: OPEN_SHARE
});

export const closeShare = () => ({
  type: CLOSE_SHARE
});

export const openFeedback = () => ({
  type: OPEN_FEEDBACK
});

export const closeFeedback = () => ({
  type: CLOSE_FEEDBACK
});

export const openJoinParticipant = (participant) => ({
  type: OPEN_JOIN_PARTICIPANT,
  participant
});

export const closeJoinParticipant = () => ({
  type: CLOSE_JOIN_PARTICIPANT
});

export const openCreateRoom = () => ({
  type: OPEN_CREATE_ROOM
});

export const closeCreateRoom = () => ({
  type: CLOSE_CREATE_ROOM
});

export const openEditRoom = (room) => ({
  type: OPEN_EDIT_ROOM,
  room
});

export const openJoinRoom = (room) => ({
  type: OPEN_JOIN_ROOM,
  room
});

export const closeJoinRoom = () => ({
  type: CLOSE_JOIN_ROOM
});

export const openRoomArchived = (room) => ({
  type: OPEN_ROOM_ARCHIVED,
  room
});

export const closeRoomArchived = () => ({
  type: CLOSE_ROOM_ARCHIVED
});

export const openRoomReorder = (room) => ({
  type: OPEN_ROOM_REORDER,
  room
});

export const closeRoomReorder = () => ({
  type: CLOSE_ROOM_REORDER
});
