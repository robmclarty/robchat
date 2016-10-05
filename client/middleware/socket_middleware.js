import io from 'socket.io-client'
import {
  sendMessage,
  receiveMessage,
  refreshUsers,
  addUser,
  removeUser,
  changeChannel,
  joinChannel,
  leaveChannel
} from '../actions'
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

let socket = null

export const socketMiddleware = store => next => action => {
  const result = next(action)

  if (socket) {
    switch(action.type) {
    case SEND_MESSAGE:
      socket.emit('send:message', action.message)
    // case CREATE_PRIVATE_CHAT:
    //   socket.emit('create:private')
    default:
      // do nothing
    }
  }

  return result
}

const initChatInterface = dispatch => {
  socket.on('receive:message', ({ channel, message }) => {
    dispatch(receiveMessage(channel, message))
  })
  socket.on('join:channel', ({ channel, users }) => {
    dispatch(joinChannel(channel))
    dispatch(changeChannel(channel))
    dispatch(refreshUsers(channel, users))
  })
  socket.on('user:join:channel', ({ channel, user }) => {
    dispatch(addUser(channel, user))
  })
  socket.on('user:disconnected', ({ channel, userId }) => {
    dispatch(removeUser(channel, userId))
  })
  socket.on('create:private', ({ channel, users }) => {
    dispatch(refreshUsers(channel, users))
  })
}

export const configureSockets = () => (dispatch, callApi, getState) => {
  console.log('initiating socket connection...')

  socket = io.connect(config.socketUrl, { path: '/chat' })

  socket.on('connect', () => {
    socket.emit('authenticate', { token: getState().auth.tokens.accessToken })

    socket.on('authenticated', () => {
      console.log('socket connection authenticated successfully')
      initChatInterface(dispatch)
    })

    socket.on('unauthorized', msg => {
      console.log('unauthorized socket connection')
      socket.disconnect()
    })
  })
}

export default socketMiddleware
