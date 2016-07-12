'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const socketio = require('socket.io')
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

// Routes
const publicRoutes = require('./routes/public_routes')
const userRoutes = require('./routes/user_routes')
const authRoutes = require('./routes/auth_routes')

app.use('/', [
  authRoutes,
  publicRoutes
])

app.use('/', [
  cred.requireAccessToken,
  userRoutes
])

// Sockets
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
