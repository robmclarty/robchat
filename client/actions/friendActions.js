import config from '../../config/client';
import {
  STORE_FRIENDS,
  FETCH_FRIENDS_PENDING,
  FETCH_FRIENDS_SUCCESS,
  FETCH_FRIENDS_FAIL,
  REQUEST_FRIENDSHIP_PENDING,
  REQUEST_FRIENDSHIP_SUCCESS,
  REQUEST_FRIENDSHIP_FAIL
} from '../constants/ActionTypes';
import {
  STATUS_PENDING,
  STATUS_SUCCESS,
  STATUS_FAIL
} from '../constants/FlashMessageTypes';
import { showFlashMessages } from './';

// Fetch Friends
// -------------
export const fetchFriends = userId => (dispatch, callApi) => {
  dispatch(fetchFriendsPending())

  return callApi({
    url: `${ config.authRoot }/users/${ userId }/friends`,
    method: 'GET'
  })
    .then(json => dispatch(storeFriends(json.users)))
    .then(() => dispatch(fetchFriendsSuccess()))
    .catch(err => dispatch(fetchFriendsFail(err)))
}

const storeFriends = users => ({
  type: STORE_FRIENDS,
  users
})

const fetchFriendsPending = () => ({
  type: FETCH_FRIENDS_PENDING
})

const fetchFriendsSuccess = () => ({
  type: FETCH_FRIENDS_SUCCESS,
  receivedAt: Date.now()
})

const fetchFriendsFail = error => ({
  type: FETCH_FRIENDS_FAIL,
  error
})


// Request Friendship
// ------------------
export const requestFriendship = (userId, username) => (dispatch, callApi) => {
  //dispatch(requestFriendshipPending())

  return callApi({
    url: `${ config.authRoot }/users/${ userId }/friends`,
    method: 'POST',
    body: { username }
  })
    .then(() => dispatch(showFlashMessages({
      status: STATUS_SUCCESS,
      messages: ['Friend request sent.']
    })))
    .catch(err => dispatch(showFlashMessages({
      status: STATUS_FAIL,
      messages: [err]
    })))
}

const requestFriendshipPending = () => ({
  type: REQUEST_FRIENDSHIP_PENDING
})

const requestFriendshipSuccess = user => ({
  type: REQUEST_FRIENDSHIP_SUCCESS,
  user
})

const requestFriendshipFail = error => ({
  type: REQUEST_FRIENDSHIP_FAIL,
  error
})
