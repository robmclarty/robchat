import {
  STORE_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_PENDING,
  FETCH_USER_FAIL,
  UPDATE_USER,
  UPDATE_USER_PENDING,
  UPDATE_USER_FAIL
} from '../constants/ActionTypes';
import fetchable from '../transducers/fetchable';

const defaultState = {
  isFetching: true,
  errorMessage: ''
}

const user = (state = defaultState, action) => {
  switch (action.type) {
  case STORE_USER:
    return {
      ...state,
      ...action.user
    }
  case UPDATE_USER:
    return {
      ...state,
      ...action.user
    }
  default:
    return state
  }
}

const fetchableUser = fetchable(user, {
  FETCH_PENDING: FETCH_USER_PENDING,
  FETCH_SUCCESS: FETCH_USER_SUCCESS,
  FETCH_FAIL: FETCH_USER_FAIL
})

export default fetchableUser
