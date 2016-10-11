import {
  UPDATE_USER,
  UPDATE_USER_PENDING,
  UPDATE_USER_FAIL
} from '../constants/ActionTypes'
import {
  STATUS_PENDING,
  STATUS_SUCCESS,
  STATUS_ERROR
} from '../constants/FlashTypes'
import config from '../../config/client'
import { showFlash } from './'

export const updateUser = profile => (dispatch, callApi) => {
  dispatch(updateUserPending())

  return callApi({
    url: `${ config.authRoot }/users/${ profile.id }`,
    method: 'PUT',
    body: profile
  })
    .then(res => {
      dispatch(updateUserSuccess(res.user))
      dispatch(showFlash({
        status: STATUS_SUCCESS,
        messages: ['Profile updated.']
      }))
    })
    .catch(err => {
      dispatch(updateUserFail(err))
      dispatch(showFlash({
        status: STATUS_ERROR,
        messages: [err]
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
