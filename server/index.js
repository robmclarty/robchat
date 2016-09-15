'use strict'

const express = require('express')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const socketio = require('socket.io')
const mongoose = require('mongoose')
const cred = require('./cred')
const config = require('../config/server')

const app = express()
const io = socketio()

// Accept application/json
app.use(bodyParser.json())
app.use(expressValidator())

// Serve static files from /build in development (on the production server,
// this would be handled by a web server/proxy like nginx).
if (process.env.NODE_ENV === ('development' || 'test')) {
  app.use('/', express.static(`${ __dirname }/../build`))
}

// Logs
if (process.env.NODE_ENV === ('development' || 'test')) {
  app.use(morgan('dev'))
}

// Database
mongoose.Promise = global.Promise
mongoose.connect(config.database)
mongoose.connection.on('connected', () => console.log('Connected to Mongo.'))
mongoose.connection.on('error', err => console.log('Database Error: ', err))
mongoose.connection.on('disconnected', () => console.log('Disconnected from Mongo.'))

// Routes
const publicRoutes = require('./routes/public_routes')
const userRoutes = require('./routes/user_routes')
const friendRoutes = require('./routes/friend_routes')
const authRoutes = require('./routes/auth_routes')

app.use('/', [
  authRoutes,
  userRoutes,
  friendRoutes,
  publicRoutes
])

// API Errors
const {
  unauthorized,
  forbidden,
  badRequest,
  unprocessable,
  genericError,
  pageNotFound
} = require('./middleware/error_middleware')

app.use([
  unauthorized,
  forbidden,
  badRequest,
  unprocessable,
  genericError,
  pageNotFound
])

// Sockets

// auth middleware
const jwt = require('jsonwebtoken')

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

// Used to track all connected users.
const socketUsers = {}

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

const connectedUsers = io => Object.keys(io.sockets.sockets).map(id => {
  return socketUsers[id]
})

const initSocketConnection = socket => {
  io.sockets.emit('user:join', connectedUsers(io))

  socket.on('chat:message', msg => {
    console.log('message: ', msg)
    io.sockets.emit('chat:message', msg)
  })
}

// main app
io.on('connection', socket => {
  console.log('a user connected')

  socket.on('authenticate', data => {
    verifyToken(data.token)
      .catch(err => socket.emit('unauthorized', err, () => socket.close()))
      .then(token => {
        console.log('socket authenticated')
        socket.emit('authenticated')
        addSocketUser(socket.id, token)
        initSocketConnection(socket)
      })
      .catch(err => console.log('problem initializing socket connection', err))
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    removeSocketUser(socket.id)
    io.sockets.emit('user:leave', connectedUsers(io))
  })
})

module.exports = {
  app,
  io
}
