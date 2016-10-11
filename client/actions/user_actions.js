import { push } from 'react-router-redux'
import {
  STORE_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_PENDING,
  FETCH_USER_FAIL,
  UPDATE_USER,
  UPDATE_USER_PENDING,
  UPDATE_USER_FAIL
} from '../constants/ActionTypes'
import {
  STATUS_PENDING,
  STATUS_SUCCESS,
  STATUS_ERROR
} from '../constants/FlashTypes'
import { showFlash, hideFlash } from './'
import config from '../../config/client'

const usersUrl = `${ config.authRoot }/users`

// Fetch User Auth
// ---------------
export const fetchUser = userId => (dispatch, callApi) => {
  dispatch(fetchUserPending())

  return callApi({
    url: `${ usersUrl }/${ userId }`,
    method: 'GET'
  })
    .then(res => dispatch(storeUser(res.user)))
    .then(() => dispatch(fetchUserSuccess()))
    .then(() => dispatch(hideFlash('user')))
    .catch(err => dispatch(fetchUserFail(err)))
}

const storeUser = user => ({
  type: STORE_USER,
  user
})

const fetchUserPending = () => ({
  type: FETCH_USER_PENDING
})

const fetchUserSuccess = () => ({
  type: FETCH_USER_SUCCESS,
  receivedAt: Date.now()
})

const fetchUserFail = error => {
  console.log(error)
return ({
  type: FETCH_USER_FAIL,
  error
})
}

// Update User Auth
// ----------------
export const updateUser = user => (dispatch, callApi) => {
  dispatch(updateUserPending())

  return callApi({
    url: `${ usersUrl }/${ user.id }`,
    method: 'PUT',
    body: user
  })
    .then(res => dispatch(updateUserSuccess(res.user)))
    .then(() => dispatch(push(`/app/profile`)))
    .then(() => dispatch(showFlash({
      status: STATUS_SUCCESS,
      messages: ['Login credentials updated']
    })))
    .catch(err => {
      dispatch(updateUserFail(err))
      dispatch(showFlash({
        status: STATUS_ERROR,
        messages: err
      }))
    })
}

const updateUserPending = () => ({
  type: UPDATE_USER_PENDING
})

const updateUserSuccess = user => ({
  type: UPDATE_USER,
  user
})

const updateUserFail = error => ({
  type: UPDATE_USER_FAIL,
  error
})
