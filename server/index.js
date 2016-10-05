'use strict'

const express = require('express')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cred = require('./cred')
const config = require('../config/server')

const app = express()

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

// Initialize Sockets
const socketio = require('socket.io')
const io = socketio()
const sockets = require('./sockets')

sockets.init(io)

module.exports = {
  app,
  io
}
