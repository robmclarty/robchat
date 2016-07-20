import {
  STORE_FRIENDS,
  FETCH_FRIENDS_PENDING,
  FETCH_FRIENDS_SUCCESS,
  FETCH_FRIENDS_FAIL,
  REQUEST_FRIENDSHIP_PENDING,
  REQUEST_FRIENDSHIP_SUCCESS,
  REQUEST_FRIENDSHIP_FAIL
} from '../constants/ActionTypes';
import fetchable from '../transducers/fetchable';

const defaultState = {
  list: [],
  isRequestingFriendship: false
}

const friends = (state = defaultState, action) => {
  switch (action.type) {
  case STORE_FRIENDS:
    return {
      ...state,
      list: action.users
    }
  case REQUEST_FRIENDSHIP_PENDING:
    return {
      ...state,
      isRequestingFriendship: true
    }
  case REQUEST_FRIENDSHIP_SUCCESS:
    return {
      ...state,
      isRequestingFriendship: false
    }
  case REQUEST_FRIENDSHIP_FAIL:
    return {
      ...state,
      isRequestingFriendship: false
    }
  default:
    return state
  }
}

const fetchableFriends = fetchable(friends, {
  FETCH_PENDING: FETCH_FRIENDS_PENDING,
  FETCH_SUCCESS: FETCH_FRIENDS_SUCCESS,
  FETCH_FAIL: FETCH_FRIENDS_FAIL
})

export default fetchableFriends
