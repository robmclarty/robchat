import {
  STORE_PROFILE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_PENDING,
  FETCH_PROFILE_FAIL,
  UPDATE_PROFILE,
  UPDATE_PROFILE_PENDING,
  UPDATE_PROFILE_FAIL
} from '../constants/ActionTypes';
import fetchable from '../transducers/fetchable';

const defaultState = {
  isFetching: true,
  errorMessage: ''
}

const profile = (state = defaultState, action) => {
  switch (action.type) {
  case STORE_PROFILE:
    return {
      ...state,
      ...action.profile
    }
  case UPDATE_PROFILE:
    return {
      ...state,
      ...action.profile
    }
  default:
    return state
  }
}

const fetchableProfile = fetchable(profile, {
  FETCH_PENDING: FETCH_PROFILE_PENDING,
  FETCH_SUCCESS: FETCH_PROFILE_SUCCESS,
  FETCH_FAIL: FETCH_PROFILE_FAIL
})

export default fetchableProfile
