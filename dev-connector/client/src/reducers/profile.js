import * as Types from '../constants/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case Types.GET_PROFILE:
    case Types.UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case Types.GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };
    case Types.PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case Types.CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    case Types.GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false,
      };
    case Types.NO_REPOS:
      return {
        ...state,
        repos: [],
      };
    default:
      return state;
  }
}
