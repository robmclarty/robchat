import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  REFRESH_USER_LIST,
  REMOVE_USER,
  JOIN_CHANNEL,
  LEAVE_CHANNEL
} from '../constants/ActionTypes'
import config from '../../config/client'

export const sendMessage = msg => ({
  type: SEND_MESSAGE,
  message: msg
})

export const receiveMessage = msg => ({
  type: RECEIVE_MESSAGE,
  message: msg
})

export const refreshUserList = users => ({
  type: REFRESH_USER_LIST,
  users
})

export const removeUser = socketId => ({
  type: REMOVE_USER,
  socketId
})

export const joinChannel = channel => ({
  type: JOIN_CHANNEL,
  channel
})

export const leaveChannel = channel => ({
  type: LEAVE_CHANNEL,
  channel
})

export const createPrivateChat = (userId, friendId) => (dispatch, callApi) => {
  dispatch(createPrivateChatPending())

  // return callApi({
  //   url: `${ config.`
  // })
}

const createPrivateChatPending = () => ({
})

const createPrivateChatSuccess = () => ({
})

const createPrivateChatFail = err => ({
})
