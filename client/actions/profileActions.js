import config from '../../config/client';
import {
  STORE_PROFILE,
  FETCH_PROFILE_PENDING,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL
} from '../constants/ActionTypes';

// Fetch Profile
// -------------
export const fetchProfile = userId => (dispatch, callApi) => {
  dispatch(fetchProfilePending())

  return callApi({
    url: `${ config.authRoot }/users/${ userId }`,
    method: 'GET'
  })
    .then(json => dispatch(storeProfile(json.user)))
    .then(() => dispatch(fetchProfileSuccess()))
    .catch(err => dispatch(fetchProfileFail(err)))
}

const storeProfile = user => ({
  type: STORE_PROFILE,
  user
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
