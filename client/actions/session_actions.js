import redveil from 'redveil'
import base64 from 'base64-js'
import {
  SEND_PUBLIC_KEY,
  RECEIVE_PUBLIC_KEY,
  UPDATE_CHANNEL_KEYS
} from '../constants/ActionTypes'

export const createUserKeys = (channel, myId, userId, socketId) => dispatch => {
  // Generate new key pair for each user in channel.
  const keys = redveil.keyPair(redveil.generateRandomBytes({
    lib: 'webcrypto',
    size: 32
  }))
  const publicKey = base64.fromByteArray(keys.publicKey)
  const secretKey = base64.fromByteArray(keys.secretKey)

  console.log('ids: ', myId, userId)

  // Store new public/secret keys generated for each user in channel.
  dispatch(updateChannelKeys(channel, myId, userId, publicKey, secretKey))

  // Broadcast public key to all users in channel.
  dispatch(sendPublicKey(channel, myId, userId, socketId, publicKey))
}

export const createChannelKeys = (channel, users, myId) => dispatch => {
  users.forEach(user => createUserKeys(channel, myId, user.userId, user.socketId)(dispatch))
}

export const sendPublicKey = (channel, senderId, userId, socketId, publicKey) => ({
  type: SEND_PUBLIC_KEY,
  channel,
  socketId,
  userId,
  senderId,
  publicKey
})

export const updateChannelKeys = (channel, myId, userId, publicKey, secretKey) => ({
  type: UPDATE_CHANNEL_KEYS,
  channel,
  myId,
  userId,
  publicKey,
  secretKey
})

export const receivePublicKey = (channel, senderId, userId, publicKey) => ({
  type: RECEIVE_PUBLIC_KEY,
  channel,
  senderId,
  userId,
  publicKey
})
