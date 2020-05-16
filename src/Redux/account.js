import axios from "src/utils/axios";
import firebase from "src/modules/firebaseApp";
import { getUserDb } from "src/modules/users";
/* eslint-disable no-param-reassign */
import produce from "immer";

export const LOGIN_REQUEST = "@account/login-request";
export const LOGIN_SUCCESS = "@account/login-success";
export const LOGIN_FAILURE = "@account/login-failure";
export const SILENT_LOGIN = "@account/silent-login";
export const LOGOUT = "@account/logout";
export const REGISTER = "@account/register";
export const UPDATE_PROFILE = "@account/update-profile";

export function login(email, password) {
  return async (dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });

      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      const { user } = result;
      const userDb = await getUserDb(user.uid);
      if (!userDb) {
        await firebase.auth().signOut();
        dispatch({
          type: LOGIN_FAILURE,
          error: "We couldn't recognize yourself"
        });
        return false;
      }
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: userDb
        }
      });
      return true;
    } catch (error) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: { error: "We couldn't recognize yourself" }
      });
      return false;
    }
  };
}

export function loginWithGoogle() {
  return async (dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });

      const provider = new firebase.auth.GoogleAuthProvider();

      const result = await firebase.auth().signInWithPopup(provider);
      const { user } = result;
      const userDb = await getUserDb(user.uid);
      if (!userDb) {
        await firebase.auth().signOut();
        dispatch({
          type: LOGIN_FAILURE,
          error: "We couldn't recognize yourself"
        });
        return false;
      }
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: userDb
        }
      });
      return true;
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE });
      return false;
    }
  };
}

export function setUserData(user) {
  return (dispatch) =>
    dispatch({
      type: SILENT_LOGIN,
      payload: {
        user
      }
    });
}

export function logout() {
  return async (dispatch) => {
    await firebase.auth().signOut();

    dispatch({
      type: LOGOUT
    });
  };
}

export function register() {
  return true;
}

export function updateProfile(update) {
  const request = axios.post("/api/account/profile", { update });

  return (dispatch) => {
    request.then((response) =>
      dispatch({
        type: UPDATE_PROFILE,
        payload: response.data
      })
    );
  };
}

const initialState = {
  user: null,
  error: null
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST: {
      return produce(state, (draft) => {
        // Ensure we clear current session
        draft.user = null;
        draft.error = null;
      });
    }

    case LOGIN_SUCCESS: {
      const { user } = action.payload;

      return produce(state, (draft) => {
        draft.user = user;
        draft.error = null;
      });
    }

    case LOGIN_FAILURE: {
      const { error } = action.payload;

      return produce(state, (draft) => {
        draft.user = null;
        draft.error = error;
      });
    }

    case LOGOUT: {
      return produce(state, (draft) => {
        draft.user = null;
        draft.error = null;
      });
    }

    case SILENT_LOGIN: {
      const { user } = action.payload;

      return produce(state, (draft) => {
        draft.user = user;
        draft.error = null;
      });
    }

    case UPDATE_PROFILE: {
      const { user } = action.payload;

      return produce(state, (draft) => {
        draft.user = user;
      });
    }

    default: {
      return state;
    }
  }
};

export default accountReducer;
