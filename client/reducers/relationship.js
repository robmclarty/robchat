import {
  STORE_RELATIONSHIPS,
  FETCH_RELATIONSHIPS_PENDING,
  FETCH_RELATIONSHIPS_SUCCESS,
  FETCH_RELATIONSHIPS_FAIL,
  REQUEST_FRIENDSHIP_PENDING,
  REQUEST_FRIENDSHIP_SUCCESS,
  REQUEST_FRIENDSHIP_FAIL
} from '../constants/ActionTypes';
import fetchable from '../transducers/fetchable';

const defaultState = {
  friends: [],
  requests: [],
  rejections: [],
  declines: [],
  bans: [],
  isRequestingFriendship: false
}

const relationships = (state = defaultState, action) => {
  switch (action.type) {
  case STORE_RELATIONSHIPS:
    return action.relationships
  case REQUEST_FRIENDSHIP_PENDING:
    return {
      ...state,
      isRequestingFriendship: true
    }
  case REQUEST_FRIENDSHIP_SUCCESS:
    return {
      ...state,
      requests: [
        ...requests,
        action.friend
      ],
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

const fetchableRelationships = fetchable(relationships, {
  FETCH_PENDING: FETCH_RELATIONSHIPS_PENDING,
  FETCH_SUCCESS: FETCH_RELATIONSHIPS_SUCCESS,
  FETCH_FAIL: FETCH_RELATIONSHIPS_FAIL
})

export default fetchableRelationships
