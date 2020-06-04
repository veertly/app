import _ from "lodash";
import {
  MAX_PARTICIPANTS_GROUP,
  DEFAULT_OFFLINE_INTERVAL
} from "../Config/constants";
import * as moment from "moment";
import { VERTICAL_NAV_OPTIONS } from "../Contexts/VerticalNavBarContext";

///// constants
const UPDATE_EVENT_SESSION = "eventSession.UPDATE_EVENT_SESSION";
const UPDATE_EVENT_SESSION_DETAILS =
  "eventSession.UPDATE_EVENT_SESSION_DETAILS";
const UPDATE_PARTICIPANTS_JOINED = "eventSession.UPDATE_PARTICIPANTS_JOINED";
const UPDATE_LIVE_GROUPS = "eventSession.UPDATE_LIVE_GROUPS";
const UPDATE_USERS = "eventSession.UPDATE_USERS";

const UPDATE_USER_ID = "eventSession.UPDATE_USER_ID";
const STATE_LOADED = "eventSession.STATE_LOADED";

const CROSS_CHECK_KEEP_ALIVES = "eventSession.CROSS_CHECK_KEEP_ALIVES";

const SET_FILTERS = "eventSessions.SET_FILTERS";

const SET_ENABLED_FEATURES = "eventSessions.SET_ENABLED_FEATURES";
const CLEAR_EVENT_SESSION = "eventSessions.CLEAR_EVENT_SESSION";

// const SET_MUTE_AUDIO_ON_ENTER = "eventSessions.SET_AUDIO_ON_ENTER";
// const SET_MUTE_VIDEO_ON_ENTER = "eventSessions.SET_VIDEO_ON_ENTER";

const initialState = {
  eventSession: null,
  eventSessionDetails: null,
  participantsJoined: null,
  liveGroupsOriginal: null,
  liveGroups: null,
  users: null,
  userId: null, // logged in user's id
  user: null, // logged in user's participantDetails object
  userSession: null, // logged in user's participantJoined object
  userGroup: null, // current group of the logged in user
  stateLoaded: false,
  availableParticipantsList: [],
  keepAlives: {},
  filters: {},
  enabledFeatures: {},
  // muteVideoOnEnter: false,
  // muteAudioOnEnter: false,
};

const isStillLive = (keepAlive) =>
  !keepAlive ||
  (keepAlive.lastSeen &&
    moment(keepAlive.lastSeen.toDate())
      .add(DEFAULT_OFFLINE_INTERVAL, "ms")
      .isAfter(moment()));

const crossCheckLiveGroups = (participantsJoined, liveGroups, keepAlives) => {
  return _.reduce(
    liveGroups,
    (result, group) => {
      if (!group.isLive) {
        return result; //skip group
      }
      let groupResult = { ...group };

      let newParticipants = {};
      let participants = Object.values(group.participants);

      let { isRoom, isRoomArchived } = group;

      for (let i = 0; i < participants.length; i++) {
        let { leftTimestamp, id } = participants[i];
        if (leftTimestamp !== null) {
          continue; // participant has already left
        }

        let participantSession = participantsJoined[id];
        let keepAlive = keepAlives[id];

        if (
          participantSession &&
          participantSession.isOnline &&
          isStillLive(keepAlive)
        ) {
          newParticipants[id] = participants[i];
        }
      }
      groupResult.participants = newParticipants;

      if (isRoom && !isRoomArchived) {
        // if it is a room, add
        result[group.id] = groupResult;
        return result;
      }

      let numAvailableParticipants = _.size(newParticipants);

      if (numAvailableParticipants <= 1) {
        return result; //skip group
      }

      if (numAvailableParticipants >= MAX_PARTICIPANTS_GROUP) {
        groupResult.isFull = true;
      }

      result[group.id] = groupResult;
      return result;
    },
    {}
  );
};

const crossCheckParticipantsJoined = (
  participantsJoined,
  liveGroups,
  keepAlives,
  userId
) => {
  return _.reduce(
    participantsJoined,
    (result, participant) => {
      let participantResult = { ...participant };

      if (participant.id === userId) {
        participantResult.isMyUser = true;
      }

      let keepAlive = keepAlives[participant.id];

      //check if still online (keep alive)
      if (
        !participantResult.isMyUser &&
        (!participant.isOnline || !isStillLive(keepAlive))
      ) {
        return result; // skip this participant as he is offline
      }

      result.push(participantResult);
      return result;
    },
    []
  );
};


///////// Reducer
export const eventSessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_EVENT_SESSION: {
      return {
        ...state,
        eventSession: action.eventSession
      };
    }

    case UPDATE_EVENT_SESSION_DETAILS: {
      return {
        ...state,
        eventSessionDetails: action.eventSessionDetails
      };
    }

    case UPDATE_PARTICIPANTS_JOINED: {
      let newParticipantsJoined = _.keyBy(action.participantsJoined, "id");

      let liveGroups = crossCheckLiveGroups(
        newParticipantsJoined,
        state.liveGroupsOriginal,
        state.keepAlives
      );
      let availableParticipantsList = crossCheckParticipantsJoined(
        newParticipantsJoined,
        liveGroups,
        state.keepAlives,
        state.userId
      );

      return {
        ...state,
        participantsJoined: newParticipantsJoined,
        availableParticipantsList,
        liveGroups
      };
    }

    case UPDATE_LIVE_GROUPS: {
      let liveGroupsOriginal = _.keyBy(action.liveGroups, "id");
      let liveGroups = crossCheckLiveGroups(
        state.participantsJoined,
        liveGroupsOriginal,
        state.keepAlives
      );
      let availableParticipantsList = crossCheckParticipantsJoined(
        state.participantsJoined,
        liveGroups,
        state.keepAlives,
        state.userId
      );
      return {
        ...state,
        liveGroups,
        liveGroupsOriginal,
        availableParticipantsList
      };
    }

    case CROSS_CHECK_KEEP_ALIVES: {
      let newKeepAlives = _.keyBy(action.keepAlives, "id");

      let liveGroups = crossCheckLiveGroups(
        state.participantsJoined,
        state.liveGroupsOriginal,
        newKeepAlives
      );

      let availableParticipantsList = crossCheckParticipantsJoined(
        state.participantsJoined,
        liveGroups,
        newKeepAlives,
        state.userId
      );

      return {
        ...state,
        keepAlives: newKeepAlives,
        liveGroups,
        availableParticipantsList
      };
    }

    case UPDATE_USERS: {
      let newUsers = _.keyBy(action.users, "id");
      return {
        ...state,
        users: newUsers,
        user: state.userId && newUsers ? newUsers[state.userId] : null
      };
    }

    case UPDATE_USER_ID: {
      return {
        ...state,
        userId: action.userId,
        user: state.users ? state.users[action.userId] : null
      };
    }

    case STATE_LOADED: {
      return {
        ...state,
        stateLoaded: action.stateLoaded
      };
    }

    case SET_FILTERS: {
      return {
        ...state,
        filters: action.filters
      };
    }
    case SET_ENABLED_FEATURES: {
      return {
        ...state,
        enabledFeatures: action.enabledFeatures
      };
    }
    // case SET_MUTE_AUDIO_ON_ENTER: {
    //   return  {
    //     ...state,
    //     muteAudioOnEnter: !state.muteAudioOnEnter
    //   }
    // }
    // case SET_MUTE_VIDEO_ON_ENTER: {
    //   return {
    //     ...state,
    //     muteVideoOnEnter: !state.muteVideoOnEnter,
    //   }
    // }
    case CLEAR_EVENT_SESSION: {
      return { ...state, ...initialState };
    }
    default:
      return state;
  }
};


////////////////////////// selectors

export const getSessionId = (store) =>
  store.eventSession.eventSession
    ? store.eventSession.eventSession.id.toLowerCase()
    : null;
export const getEventSession = (store) => store.eventSession.eventSession;
export const getEventSessionDetails = (store) =>
  store.eventSession.eventSessionDetails;
export const getParticipantsJoined = (store) =>
  store.eventSession.participantsJoined;
export const getLiveGroups = (store) => store.eventSession.liveGroups;
export const getLiveGroupsOriginal = (store) =>
  store.eventSession.liveGroupsOriginal;
export const getUsers = (store) => store.eventSession.users;
export const getUserId = (store) => store.eventSession.userId;
export const getUser = (store) => store.eventSession.user;
export const getUserSession = (store) =>
  store.eventSession.userId && store.eventSession.participantsJoined
    ? store.eventSession.participantsJoined[store.eventSession.userId]
    : null;
export const getUserCurrentLocation = (store) =>
  store.eventSession.userId &&
  store.eventSession.participantsJoined &&
  store.eventSession.participantsJoined[store.eventSession.userId] &&
  store.eventSession.participantsJoined[store.eventSession.userId]
    .currentLocation
    ? store.eventSession.participantsJoined[store.eventSession.userId]
        .currentLocation
    : VERTICAL_NAV_OPTIONS.lobby;

export const getUserAvailableForCall = (store) =>
  store.eventSession.userId &&
  store.eventSession.participantsJoined &&
  store.eventSession.participantsJoined[store.eventSession.userId] &&
  store.eventSession.participantsJoined[store.eventSession.userId]
    .availableForCall !== false;

export const isEventOwner = (store) =>
  store.eventSession.userId === store.eventSession.eventSessionDetails.owner;

// get original db entry of the current group
export const getUserGroup = (store) => {
  let userSession = getUserSession(store);
  let { liveGroupsOriginal } = store.eventSession;
  return userSession && liveGroupsOriginal && userSession.groupId
    ? liveGroupsOriginal[userSession.groupId]
    : null;
};

// get current group with only live participants
export const getUserLiveGroup = (store) => {
  let userSession = getUserSession(store);
  let { liveGroups } = store.eventSession;
  return userSession && liveGroups && userSession.groupId
    ? liveGroups[userSession.groupId]
    : null;
};
export const isInNetworkingRoom = (store) => {
  let userSession = getUserSession(store);
  return userSession && userSession.inNetworkingRoom;
};

export const isStateLoaded = (store) => store.eventSession.stateLoaded === true;
export const getAvailableParticipantsList = (store) =>
  store.eventSession.availableParticipantsList;
export const getFilters = (store) => store.eventSession.filters;

export const getFeatureDetails = (feature) => (store) => {
  return store.eventSession.enabledFeatures &&
    store.eventSession.enabledFeatures[feature]
    ? store.eventSession.enabledFeatures[feature]
    : null;
};

export const getMuteAudioOnEnter = (store) => store.eventSession.muteAudioOnEnter;

export const getMuteVideoOnEnter = (store) => store.eventSession.muteVideoOnEnter;

////////////////// action creators

export const updateEventSession = (eventSession) => ({
  type: UPDATE_EVENT_SESSION,
  eventSession
});

export const updateEventSessionDetails = (eventSessionDetails) => ({
  type: UPDATE_EVENT_SESSION_DETAILS,
  eventSessionDetails
});

export const updateParticipantsJoined = (participantsJoined) => ({
  type: UPDATE_PARTICIPANTS_JOINED,
  participantsJoined
});

export const updateLiveGroups = (liveGroups) => ({
  type: UPDATE_LIVE_GROUPS,
  liveGroups
});
export const updateUsers = (users) => ({
  type: UPDATE_USERS,
  users
});
export const updateUserId = (userId) => ({
  type: UPDATE_USER_ID,
  userId
});
export const setStateLoaded = (stateLoaded) => ({
  type: STATE_LOADED,
  stateLoaded
});

export const crossCheckKeepAlives = (keepAlives) => ({
  type: CROSS_CHECK_KEEP_ALIVES,
  keepAlives
});

export const setFilters = (filters) => ({
  type: SET_FILTERS,
  filters
});

export const setEnabledFeatures = (enabledFeatures) => ({
  type: SET_ENABLED_FEATURES,
  enabledFeatures
});

export const clearEventSession = () => ({
  type: CLEAR_EVENT_SESSION
});



///////// thunks
// export const setMuteVideo = (sessionId) => (dispatch, state) => {
//   const muteVideoPrevious = stateMapping(state).eventSession.muteVideoOnEnter
//   setVideoMuteStatusDB(!muteVideoPrevious,)
//   return ({
//     type: SET_MUTE_VIDEO_ON_ENTER,
//     muteVideoOnEnter: muteVideoPrevious,
//   })
// };

// export const setMuteAudio = (muteAudioOnEnter) => ({
//   type: SET_MUTE_AUDIO_ON_ENTER,
//   // muteAudioOnEnter,
// })