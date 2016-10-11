'use strict'

const express = require('express')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const cred = require('./cred')
const config = require('../config/server')

const app = express()

app.set('assets-path', config.assetsPath)
app.set('app-name', config.appName)

// Accept application/json
app.use(bodyParser.json())

// Enable cross-origin resource sharing.
app.use(cors({
  origin: config.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}))

// Pass remote address through proxy so that limiter knows about it.
app.enable("trust proxy")

// Disable X-Powered-By header.
app.disable('x-powered-by')

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
const profileRoutes = require('./routes/profile_routes')
const friendRoutes = require('./routes/friend_routes')

// Unauthenticated routes
app.use('/', [
  publicRoutes
])

// All API routes require a valid token and an active user account.
app.use('/', [
  cred.requireAccessToken,
  cred.requireProp('isActive', true),
  profileRoutes,
  friendRoutes
])

// API Errors
const errorHandler = require('./middleware/error_middleware')

app.use([
  errorHandler.sequelizeError,
  errorHandler.unauthorized,
  errorHandler.forbidden,
  errorHandler.conflict,
  errorHandler.badRequest,
  errorHandler.unprocessable,
  errorHandler.notFound,
  errorHandler.genericError,
  errorHandler.catchall
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
