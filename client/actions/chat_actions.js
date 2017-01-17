import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  REFRESH_USERS,
  ADD_USER,
  REMOVE_USER,
  CHANGE_CHANNEL,
  JOIN_CHANNEL,
  LEAVE_CHANNEL
} from '../constants/ActionTypes'
import config from '../../config/client'

export const sendMessage = ({
  channel,
  userId,
  username,
  body,
  createdAt
}) => ({
  type: SEND_MESSAGE,
  channel,
  userId,
  username,
  body,
  createdAt
})

export const receiveMessage = ({
  channel,
  userId,
  username,
  body,
  createdAt
}) => ({
  type: RECEIVE_MESSAGE,
  channel,
  userId,
  username,
  body,
  createdAt
})

export const refreshUsers = (channel, users) => ({
  type: REFRESH_USERS,
  channel,
  users
})

export const addUser = (channel, user) => ({
  type: REMOVE_USER,
  channel,
  userId
})

export const removeUser = (channel, userId) => ({
  type: REMOVE_USER,
  channel,
  userId
})

export const changeChannel = channel => ({
  type: CHANGE_CHANNEL,
  channel
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
