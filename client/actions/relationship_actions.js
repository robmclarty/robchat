import config from '../../config/client';
import {
  STORE_RELATIONSHIPS,
  FETCH_RELATIONSHIPS_PENDING,
  FETCH_RELATIONSHIPS_SUCCESS,
  FETCH_RELATIONSHIPS_FAIL,
  REQUEST_FRIENDSHIP_PENDING,
  REQUEST_FRIENDSHIP_SUCCESS,
  REQUEST_FRIENDSHIP_FAIL
} from '../constants/ActionTypes';
import {
  STATUS_PENDING,
  STATUS_SUCCESS,
  STATUS_ERROR
} from '../constants/FlashTypes';
import { showFlash } from './';

// Fetch Friends
// -------------
export const fetchRelationships = userId => (dispatch, callApi) => {
  dispatch(fetchRelationshipsPending())

  return callApi({
    url: `${ config.chatRoot }/users/${ userId }/relationships`,
    method: 'GET'
  })
    .then(json => dispatch(storeRelationships(json.relationships)))
    .then(() => dispatch(fetchRelationshipsSuccess()))
    .catch(err => dispatch(fetchRelationshipsFail(err)))
}

const storeRelationships = relationships => ({
  type: STORE_RELATIONSHIPS,
  relationships
})

const fetchRelationshipsPending = () => ({
  type: FETCH_RELATIONSHIPS_PENDING
})

const fetchRelationshipsSuccess = () => ({
  type: FETCH_RELATIONSHIPS_SUCCESS,
  receivedAt: Date.now()
})

const fetchRelationshipsFail = error => ({
  type: FETCH_RELATIONSHIPS_FAIL,
  error
})


// Request Friendship
// ------------------
export const requestFriendship = (userId, username) => (dispatch, callApi) => {
  //dispatch(requestFriendshipPending())

  return callApi({
    url: `${ config.chatRoot }/users/${ userId }/friends`,
    method: 'POST',
    body: { username }
  })
    .then(() => dispatch(showFlash({
      status: STATUS_SUCCESS,
      messages: ['Friend request sent.']
    })))
    .then(() => dispatch(fetchRelationships(userId)))
    .catch(err => dispatch(showFlash({
      status: STATUS_ERROR,
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


// Accept Friendship
// -----------------
export const acceptFriendship = (userId, friendId) => (dispatch, callApi) => {
  return callApi({
    url: `${ config.chatRoot }/users/${ userId }/friends/${ friendId }`,
    method: 'PUT'
  })
    .then(() => dispatch(showFlash({
      status: STATUS_SUCCESS,
      messages: ['Friend request accepted.']
    })))
    .then(() => dispatch(fetchRelationships(userId)))
    .catch(err => dispatch(showFlash({
      status: STATUS_ERROR,
      messages: [err]
    })))
}


// Decline Friendship
// ------------------
export const declineFriendship = (userId, friendId) => (dispatch, callApi) => {
  return callApi({
    url: `${ config.chatRoot }/users/${ userId }/friends/${ friendId }`,
    method: 'DELETE'
  })
    .then(() => dispatch(showFlash({
      status: STATUS_SUCCESS,
      messages: ['Friend request declined.']
    })))
    .then(() => dispatch(fetchRelationships(userId)))
    .catch(err => dispatch(showFlash({
      status: STATUS_ERROR,
      messages: [err]
    })))
}
