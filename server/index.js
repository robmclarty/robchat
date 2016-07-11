'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const socketio = require('socket.io')

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
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './build' })
})

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
