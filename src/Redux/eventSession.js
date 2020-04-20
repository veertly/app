import _ from "lodash";
import { DEFAULT_KEEP_ALIVE_INTERVAL } from "../Config/constants";
import moment from "moment";

const UPDATE_EVENT_SESSION = "eventSession.UPDATE_EVENT_SESSION";
const UPDATE_EVENT_SESSION_DETAILS = "eventSession.UPDATE_EVENT_SESSION_DETAILS";
const UPDATE_PARTICIPANTS_JOINED = "eventSession.UPDATE_PARTICIPANTS_JOINED";
const UPDATE_LIVE_GROUPS = "eventSession.UPDATE_LIVE_GROUPS";
const UPDATE_USERS = "eventSession.UPDATE_USERS";

const UPDATE_USER_ID = "eventSession.UPDATE_USER_ID";
const STATE_LOADED = "eventSession.STATE_LOADED";

const initialState = {
  eventSession: null,
  eventSessionDetails: null,
  participantsJoined: null,
  liveGroups: null,
  users: null,
  userId: null, // logged in user's id
  user: null, // logged in user's participantDetails object
  userSession: null, // logged in user's participantJoined object
  userGroup: null, // current group of the logged in user
  stateLoaded: false,
  availableParticipantsList: [],
};

// const calculateListAvailableParticipants = (participantsJoinedArray) => {

// }

export const eventSessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_EVENT_SESSION: {
      return {
        ...state,
        eventSession: action.eventSession,
      };
    }
    case UPDATE_EVENT_SESSION_DETAILS: {
      return {
        ...state,
        eventSessionDetails: action.eventSessionDetails,
      };
    }
    case UPDATE_PARTICIPANTS_JOINED: {
      let newParticipantsJoined = _.keyBy(action.participantsJoined, "id");

      let userSession = state.userId && newParticipantsJoined ? newParticipantsJoined[state.userId] : state.userSession;

      let userGroup =
        state.userId && state.liveGroups && userSession && userSession.groupId
          ? state.liveGroups[userSession.groupId]
          : null;

      let now = moment();

      let newAvailableParticipantsList = _.reduce(
        action.participantsJoined,
        (result, participant) => {
          let participantResult = { ...participant };

          //check if still online (keep alive)
          if (
            participant.isOnline &&
            participant.lastSeen &&
            moment(participant.lastSeen.toDate())
              .add(1.5 * DEFAULT_KEEP_ALIVE_INTERVAL, "ms")
              .isBefore(now)
          ) {
            return result; // skip this participant as he is offline
          }

          if (!participant.isOnline) {
            return result; // skip this participant as he is offline
          }

          if (participant.id === state.userId) {
            participantResult.isMyUser = true;
          }

          let isInConversation = participant && participant.groupId !== undefined && participant.groupId !== null;
          let isInConferenceRoom = !isInConversation && !participant.inNetworkingRoom;
          let isAvailable = !isInConversation && participant.inNetworkingRoom;

          participantResult.isInConversation = isInConversation;
          participantResult.isInConferenceRoom = isInConferenceRoom;
          participantResult.isAvailable = isAvailable;

          result.push(participantResult);
          return result;
        },
        []
      );

      return {
        ...state,
        participantsJoined: newParticipantsJoined,
        userSession,
        userGroup,
        availableParticipantsList: newAvailableParticipantsList,
      };
    }
    case UPDATE_LIVE_GROUPS: {
      let liveGroups = _.keyBy(action.liveGroups, "id");
      let userGroup =
        state.userId && state.liveGroups && state.userSession && state.userSession.groupId
          ? liveGroups[state.userSession.groupId]
          : null;
      return {
        ...state,
        liveGroups,
        userGroup,
      };
    }
    case UPDATE_USERS: {
      let newUsers = _.keyBy(action.users, "id");
      return {
        ...state,
        users: newUsers,
        user: state.userId && newUsers ? newUsers[state.userId] : null,
      };
    }
    case UPDATE_USER_ID: {
      return {
        ...state,
        userId: action.userId,
        user: state.users ? state.users[action.userId] : null,
      };
    }
    case STATE_LOADED: {
      return {
        ...state,
        stateLoaded: true,
      };
    }
    default:
      return state;
  }
};
export const getSessionId = (store) => (store.eventSession.eventSession ? store.eventSession.eventSession.id : null);
export const getEventSession = (store) => store.eventSession.eventSession;
export const getEventSessionDetails = (store) => store.eventSession.eventSessionDetails;
export const getParticipantsJoined = (store) => store.eventSession.participantsJoined;
export const getLiveGroups = (store) => store.eventSession.liveGroups;
export const getUsers = (store) => store.eventSession.users;
export const getUserId = (store) => store.eventSession.userId;
export const getUser = (store) => store.eventSession.user;
export const getUserSession = (store) => store.eventSession.userSession;
export const getUserGroup = (store) => store.eventSession.userGroup;
export const isInNetworkingRoom = (store) =>
  store.eventSession.userSession && store.eventSession.userSession.inNetworkingRoom;
export const isStateLoaded = (store) => store.eventSession.stateLoaded === true;
export const getAvailableParticipantsList = (store) => store.eventSession.availableParticipantsList;

export const updateEventSession = (eventSession) => ({
  type: UPDATE_EVENT_SESSION,
  eventSession,
});

export const updateEventSessionDetails = (eventSessionDetails) => ({
  type: UPDATE_EVENT_SESSION_DETAILS,
  eventSessionDetails,
});

export const updateParticipantsJoined = (participantsJoined) => ({
  type: UPDATE_PARTICIPANTS_JOINED,
  participantsJoined,
});

export const updateLiveGroups = (liveGroups) => ({
  type: UPDATE_LIVE_GROUPS,
  liveGroups,
});
export const updateUsers = (users) => ({
  type: UPDATE_USERS,
  users,
});
export const updateUserId = (userId) => ({
  type: UPDATE_USER_ID,
  userId,
});
export const setStateLoaded = (userId) => ({
  type: STATE_LOADED,
});
