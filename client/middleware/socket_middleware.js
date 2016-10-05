import io from 'socket.io-client'
import {
  receiveMessage,
  refreshUserList,
  joinChannel,
  leaveChannel,
  removeUser
} from '../actions'
import {
  SEND_MESSAGE,
  CREATE_PRIVATE_CHAT
} from '../constants/ActionTypes'
import config from '../../config/client'

let socket = null

export const socketMiddleware = store => next => action => {
  const result = next(action)

  if (socket) {
    switch(action.type) {
    case SEND_MESSAGE:
      socket.emit('send:message', action.message)
    case CREATE_PRIVATE_CHAT:
      socket.emit('create:private')
    default:
      // do nothing
    }
  }

  return result
}

const initChatInterface = dispatch => {
  socket.on('receive:message', msg => {
    console.log('received message: ', msg)
    dispatch(receiveMessage(msg))
  })
  socket.on('join:channel', ({ channel, users }) => {
    dispatch(joinChannel(channel))
    dispatch(refreshUserList(users))
  })
  socket.on('user:disconnected', socketId => dispatch(removeUser(socketId)))
  socket.on('create:private', users => {
    dispatch(refreshUserList(users))
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
      //dispatch(disconnect())
    })
  })
}

export default socketMiddleware
