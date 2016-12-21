'use strict'

const jwt = require('jsonwebtoken')
const cred = require('./cred')

// Used to track all connected users.
const socketUsers = {}

// JWT authentication middleware for socket.io
const verifyToken = token => new Promise((resolve, reject) => {
  const options = {
    issuer: cred.issuer,
    algorithms: [cred.accessOpts.algorithm]
  }

  if (!token) {
    console.log('No token provided with socket connection.')
    return reject(new Error('No token provided.'))
  }

  jwt.verify(token, cred.accessOpts.publicKey, options, (err, payload) => {
    if (err) {
      console.log('Unauthorized socket connection')
      return reject(new Error('Unauthorized socket connection'))
    }

    resolve(token)
  })
})

const createSocketUser = (socketId, token) => {
  const payload = jwt.decode(token)

  return {
    socketId,
    userId: payload.userId,
    username: payload.username
  }
}

const addSocketUser = (socketId, token) => {
  socketUsers[socketId] = createSocketUser(socketId, token)
}

const removeSocketUser = (socketId) => {
  delete socketUsers[socketId]
}

const connectedUsers = sockets => Object.keys(sockets).map(id => {
  return socketUsers[id]
})

const channelUsers = sockets => sockets.map(socket => {
  return socket.userData
})

const channelSockets = (io, channel) => {
  return Object.keys(io.sockets.adapter.rooms[channel].sockets).map(socketId => {
    return io.sockets.connected[socketId]
  })
}

const attachSocketEvents = (io, socket) => {
  socket.on('send:message', msg => {
    socket.broadcast.to(msg.channel).emit('receive:message', {
      channel: msg.channel,
      message: msg
    })
  })

  socket.on('create:private', socketId => {

  })

  socket.on('key:public:send', ({ channel, senderId, userId, socketId, publicKey }) => {
    console.log('socketId: ', socketId, senderId, userId)
    io.to(socketId).emit('key:public:receive', {
      channel,
      senderId,
      userId,
      publicKey
    })
  })
}

const LOBBY = 'lobby'

const init = io => {
  io.on('connection', socket => {
    console.log('user connected')

    socket.on('authenticate', data => {
      verifyToken(data.token)
        .catch(err => socket.emit('unauthorized', err, () => socket.close()))
        .then(token => {
          // Let the client know that authentication was successful.
          socket.emit('authenticated')

          // Set custom attributes on socket and join default channel.
          const payload = jwt.decode(token)
          socket.userData = {
            socketId: socket.id,
            userId: payload.userId,
            username: payload.username
          }
          socket.join(LOBBY)

          console.log('socket authenticated', socket.userData.username)

          // Tell eveyone in the default channel that a new user joined.
          const sockets = channelSockets(io, LOBBY)
          io.to(LOBBY).emit('join:channel', {
            channel: LOBBY,
            users: channelUsers(sockets)
          })

          // Tell everyone who is friends with this user that s/he is online.
          //io.sockets.emit('user:connected', )

          // Setup event handlers for socket.
          attachSocketEvents(io, socket)
        })
        .catch(err => socket.emit('problem initializing socket connection', err, () => socket.close()))
    })

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.userData.username)

      // Tell everyone that this user has disconnected.
      io.sockets.emit('user:disconnected', socket.id)
    })
  })
}

module.exports = {
  init
}
