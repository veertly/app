import firebase, { firebaseConfig } from "../Modules/firebaseApp";
import {
  getUserDb,
  logoutDb,
  registerNewUser
} from "../Modules/userOperations";

/* eslint-disable no-param-reassign */
import produce from "immer";
import { clearEventSession } from "./eventSession";

export const LOGIN_REQUEST = "@account/login-request";
export const LOGIN_SUCCESS = "@account/login-success";
export const LOGIN_FAILURE = "@account/login-failure";
export const SILENT_LOGIN = "@account/silent-login";
export const LOGOUT = "@account/logout";
export const RESET_STATE = "@account/reset-state";
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
      return userDb;
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
      console.log({ result });
      const { user } = result;
      const isNewUser = result.additionalUserInfo.isNewUser;

      // try out for the bug
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
      }
      
      const userDb = isNewUser
        ? await registerNewUser(result.user)
        : await getUserDb(user.uid);
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
      return userDb;
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE });
      return false;
    }
  };
}

export function loginAnonymously() {
  return async (dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });

      const result = await firebase.auth().signInAnonymously();

      const { user } = result;
      const isNewUser = result.additionalUserInfo.isNewUser;

      const userDb = isNewUser
        ? await registerNewUser(result.user)
        : await getUserDb(user.uid);
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
      return userDb;
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

export function logout(sessionId = null, userGroup = null) {
  return async (dispatch) => {
    try {
      if (sessionId) {
        await logoutDb(sessionId, userGroup);
      }

      await firebase.auth().signOut();

      dispatch({
        type: LOGOUT
      });
      dispatch(clearEventSession());
    } catch (error) {
      console.log(error);
    }
  };
}

export function register(firstName, lastName, email, password) {
  return async (dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const auth = await firebase.auth();
      const result = await auth.createUserWithEmailAndPassword(email, password);
      const { user } = result;
      console.log(user);
      await user.updateProfile({ displayName: `${firstName} ${lastName}` });
      let userDb = await registerNewUser(auth.currentUser);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: userDb
        }
      });
      return userDb;
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: { error: error.message } });
      return false;
    }
  };
}

export function resetAccountState() {
  return async (dispatch) => {
    try {
      dispatch({ type: RESET_STATE });
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: { error: error.message } });
      return false;
    }
  };
}
// export function updateProfile(update) {
//   const request = axios.post("/api/account/profile", { update });

//   return (dispatch) => {
//     request.then((response) =>
//       dispatch({
//         type: UPDATE_PROFILE,
//         payload: response.data
//       })
//     );
//   };
// }

const initialState = {
  user: null,
  error: null
};

export const accountReducer = (state = initialState, action) => {
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

    case RESET_STATE: {
      return { ...state, ...initialState };
    }

    default: {
      return state;
    }
  }
};
