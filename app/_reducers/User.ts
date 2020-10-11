// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { User } from "../_models/User";
import { authenticate, unauthenticate } from "../_helpers";

const AUTH_USER = 'AUTH_USER'
const UNAUTH_USER = 'UNAUTH_USER'
const FETCHING_USER = 'FETCHING_USER'
const FETCHING_USER_FAILURE = 'FETCHING_USER_FAILURE'
const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS'

const authUser = (uid: string) => {
  return {
    type: AUTH_USER,
    uid,
  }
}

export const unauthUser = () => {
  return {
    type: UNAUTH_USER,
  }
}

export const userLogout = () => {
  return (dispatch: any) => {
    unauthenticate().then(() => {
      dispatch(unauthUser());
    }).catch((error) => {
      console.log(error);
    })
  };
}

const fetchingUser = () => {
  return {
    type: FETCHING_USER,
  }
}

const fetchingUserFailure = (error: string) => {
  return {
    type: FETCHING_USER_FAILURE,
    error: 'Error fetching user.',
  }
}

const fetchingUserSuccess  = (uid: string, user: User, timestamp: Date) => {
  return {
    type: FETCHING_USER_SUCCESS,
    uid,
    user,
    timestamp,
  }
}

export const fetchAndHandleAuthentication = (history: any) => {
  return (dispatch: any) => {
    dispatch(fetchingUser());
    authenticate().then((user: User) => {
      dispatch(fetchingUserSuccess(user.uid, user, new Date()));
      dispatch(authUser(user.uid));
    }).catch((error) => {
      dispatch(fetchingUserFailure(error))
      history.push("/login");
    });
  };
}

const initialUserState: User = {
    uid: "",
    firstName: "",
    lastName: "",
    email: "",
    lastUpdated: new Date()
}

export const user = (state = initialUserState, action: any) => {
  switch (action.type) {
    case FETCHING_USER_SUCCESS :
      return {
        ...state,
        uid: action.uid,
        firstName: action.user.email,
        lastName: action.user.email,
        email: action.user.email,
        lastUpdated: action.timestamp
      }
    default:
      return state
  }
}

const initialState = {
  isFetching: false,
  error: "",
  isAuthed: false,
  authedId: "",
  user: initialUserState,
}

export const auth = (state = initialState, action: any) => {
  switch (action.type) {
    case AUTH_USER :
      return {
        ...state,
        isAuthed: true,
        authedId: action.uid,
      }
    case UNAUTH_USER :
      return {
        ...state,
        isAuthed: false,
        authedId: "",
      }
    case FETCHING_USER:
      return {
        ...state,
        isFetching: true,
      }
    case FETCHING_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    case FETCHING_USER_SUCCESS:
      return action.user === null
        ? {
          ...state,
          isFetching: false,
          error: "",
        }
        : {
          ...state,
          isFetching: false,
          error: "",
          user: user(action.user, action),
        }
    default :
      return state
  }
}