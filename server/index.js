'use strict'

const express = require('express')
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
const friendshipRoutes = require('./routes/friend_routes')
const authRoutes = require('./routes/auth_routes')

app.use('/', [
  authRoutes,
  userRoutes,
  friendshipRoutes,
  publicRoutes
])

// Sockets

// auth middleware
const jwt = require('jsonwebtoken')

io.use((socket, next) => {
  const token = socket.request._query.token;
  const options = {
    issuer: cred.issuer,
    algorithms: [cred.accessOpts.algorithm]
  }

  if (!token) {
    console.log('No token provided with socket connection.')
    return next(new Error('No token provided.'))
  }

  jwt.verify(token, cred.accessOpts.publicKey, options, (err, payload) => {
    if (err) {
      console.log('Unauthorized socket connection')
      return next(new Error('Unauthorized socket connection'))
    }

    console.log('socket authenticated')

    next()
  })
})

// main app
io.on('connection', socket => {
  console.log('a user connected')

  socket.on('chat message', msg => {
    console.log('message: ', msg)
    io.emit('chat message', msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

Object.assign(exports, {
  app,
  io
})
