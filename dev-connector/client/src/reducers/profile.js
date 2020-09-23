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
      return {
        ...state,
        profile: payload,
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
    default:
      return state;
  }
}
