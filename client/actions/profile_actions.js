import { push } from 'react-router-redux'
import {
  STORE_PROFILE,
  FETCH_PROFILE_PENDING,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
  UPDATE_PROFILE,
  UPDATE_PROFILE_PENDING,
  UPDATE_PROFILE_FAIL
} from '../constants/ActionTypes'
import {
  STATUS_PENDING,
  STATUS_SUCCESS,
  STATUS_ERROR
} from '../constants/FlashTypes'
import { showFlash, hideFlash } from './'
import config from '../../config/client'

const profilesUrl = `${ config.chatRoot }/profiles`

// Fetch Profile
// -------------
export const fetchProfile = userId => (dispatch, callApi) => {
  dispatch(fetchProfilePending())

  return callApi({
    url: `${ profilesUrl }/${ userId }`,
    method: 'GET'
  })
    .then(res => dispatch(storeProfile(res.profile)))
    .then(() => dispatch(fetchProfileSuccess()))
    .then(() => dispatch(hideFlash('profile')))
    .catch(err => dispatch(fetchProfileFail(err)))
}

const storeProfile = profile => ({
  type: STORE_PROFILE,
  profile
})

const fetchProfilePending = () => ({
  type: FETCH_PROFILE_PENDING
})

const fetchProfileSuccess = () => ({
  type: FETCH_PROFILE_SUCCESS,
  receivedAt: Date.now()
})

const fetchProfileFail = error => ({
  type: FETCH_PROFILE_FAIL,
  error
})

// Update Profile
// ---------------
export const updateProfile = profile => (dispatch, callApi) => {
  dispatch(updateProfilePending())

  return callApi({
    url: `${ profilesUrl }/${ profile.userId }`,
    method: 'PUT',
    body: profile
  })
    .then(res => dispatch(updateProfileSuccess(res.profile)))
    .then(() => dispatch(push(`/app/profile`)))
    .then(() => dispatch(showFlash({
      status: STATUS_SUCCESS,
      messages: ['Profile updated']
    })))
    .catch(res => {
      dispatch(updateProfileFail(res))
      dispatch(showFlash({
        status: STATUS_ERROR,
        messages: res.errors
      }))
    })
}

const updateProfilePending = () => ({
  type: UPDATE_PROFILE_PENDING
})

const updateProfileSuccess = profile => ({
  type: UPDATE_PROFILE,
  profile,
  receivedAt: Date.now()
})

const updateProfileFail = error => ({
  type: UPDATE_PROFILE_FAIL,
  error
})
