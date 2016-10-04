import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  REFRESH_USER_LIST
} from '../constants/ActionTypes'

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

export const createPrivateChat = (userId, friendId) => (dispatch, callApi) => {
  console.log('open private chat')
}
