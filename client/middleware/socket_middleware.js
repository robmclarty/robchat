import io from 'socket.io-client'
import woobie from 'woobie'
import {
  sendMessage,
  receiveMessage,
  refreshUsers,
  addUser,
  removeUser,
  changeChannel,
  joinChannel,
  leaveChannel,
  createChannelKeys,
  receivePublicKey
} from '../actions'
import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  REFRESH_USERS,
  ADD_USER,
  REMOVE_USER,
  CHANGE_CHANNEL,
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
  SEND_PUBLIC_KEY,
  RECEIVE_PUBLIC_KEY
} from '../constants/ActionTypes'
import config from '../../config/client'

let socket = null

export const socketMiddleware = store => next => action => {
  const result = next(action)

  if (socket) {
    switch(action.type) {
    case SEND_MESSAGE:
      const state = store.getState()

      // Cycle through each user in the channel and encrypt the message against
      // each user's unique shared key, then send each user their custom msg.
      const messagePromises = state.chat.channels[action.channel].users.map(user => {
        if (user.userId !== state.user.id) { // don't send message to yourself
          return woobie.encrypt({
            lib: woobie.CRYPTO_LIBS.WEBCRYPTO,
            data: action.body,
            key: user.sharedKey,
            compressed: true,
            alg: 'aes-cbc-hmac'
          })
            .then(encryptedObj => {
              console.log('encrypted msg: ', encryptedObj.data)
              //console.log('key: ', user.sharedKey)

              // An `encryptedObj` has the following format:
              // {
              //   data: [encrypted msg],
              //   iv: [initialization vector used for encryption],
              //   mac: [message authentication code]
              // }

              socket.emit('send:message:single', {
                channel: action.channel,
                receiverId: user.userId,
                senderId: state.user.id,
                socketId: user.socketId,
                createdAt: action.createdAt,
                ...encryptedObj
              })
            })
        }
      })

      Promise.all(messagePromises).catch(err => console.log(err))
    case SEND_PUBLIC_KEY:
      socket.emit('key:public:send', {
        channel: action.channel,
        senderId: action.senderId,
        userId: action.userId,
        socketId: action.socketId,
        publicKey: action.publicKey
      })
    default:
      // do nothing
    }
  }

  return result
}

const initChatInterface = (dispatch, myId, getState) => {
  socket.on('receive:message', ({ channel, message }) => {
    dispatch(receiveMessage(channel, message))
  })

  socket.on('receive:message:single', ({
    channel,
    socketId,
    senderId,
    receiverId,
    createdAt,
    data,
    iv,
    mac
  }) => {
    const state = getState()
    const senderSession = state.chat.channels[channel].users.find(user => {
      return user.userId === senderId
    })
    console.log('received data: ', data)
    console.log('iv: ', iv)
    console.log('mac: ', mac)

    woobie.decrypt({
      lib: woobie.CRYPTO_LIBS.WEBCRYPTO,
      data,
      key: senderSession.sharedKey,
      iv,
      mac,
      compressed: true,
      alg: 'aes-cbc-hmac'
    })
      .then(decryptedObj => {
        console.log('decrypted msg: ', decryptedObj.data)

        dispatch(receiveMessage({
          channel,
          body: decryptedObj.data,
          userId: senderSession.userId,
          username: senderSession.username,
          createdAt
        }))
      })
      .catch(err => {
        console.log('error decrypting data: ', err)

        dispatch(receiveMessage({
          channel,
          body: `*message has been tampered with* - ${ err }`,
          userId: senderSession.userId,
          username: senderSession.username,
          createdAt
        }))
      })
  })

  socket.on('join:channel', ({ channel, users }) => {
    dispatch(joinChannel(channel))
    dispatch(changeChannel(channel))
    dispatch(refreshUsers(channel, users))
    dispatch(createChannelKeys(channel, users, myId))
  })

  socket.on('user:join:channel', ({ channel, user }) => {
    dispatch(addUser(channel, user))
    dispatch(createUserKeys(channel, myId, user.socketId))
  })

  socket.on('user:disconnected', ({ channel, userId }) => {
    dispatch(removeUser(channel, userId))
  })

  socket.on('create:private', ({ channel, users }) => {
    dispatch(refreshUsers(channel, users))
  })

  socket.on('key:public:receive', ({ channel, senderId, userId, publicKey }) => {
    dispatch(receivePublicKey(channel, senderId, userId, publicKey))
  })
}

export const configureSockets = myId => (dispatch, callApi, getState) => {
  console.log('initiating socket connection...')

  socket = io.connect(config.socketUrl, { path: '/chat' })

  socket.on('connect', () => {
    socket.emit('authenticate', { token: getState().auth.tokens.accessToken })

    socket.on('authenticated', () => {
      console.log('socket connection authenticated successfully')
      initChatInterface(dispatch, myId, getState)
    })

    socket.on('unauthorized', msg => {
      console.log('unauthorized socket connection')
      socket.disconnect()
    })
  })
}

export default socketMiddleware
