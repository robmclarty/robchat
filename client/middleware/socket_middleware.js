import io from 'socket.io-client'
import {
  receiveMessage,
  refreshUserList
} from '../actions'
import { SEND_MESSAGE } from '../constants/ActionTypes'
import config from '../../config/client'

let socket = null

export const socketMiddleware = store => next => action => {
  const result = next(action)

  if (socket && action.type === SEND_MESSAGE) {
    console.log('send message to server: ', action.message)
    socket.emit('send:message', action.message)
  }

  return result
}

const initChatInterface = dispatch => {
  socket.on('receive:message', msg => dispatch(receiveMessage(msg)))
  socket.on('user:join', users => dispatch(refreshUserList(users)))
  socket.on('user:leave', users => dispatch(refreshUserList(users)))
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
