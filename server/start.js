#!/usr/bin/env node

'use strict'

const { app, io } = require('../server')
const models = require('./models')

app.set('port', process.env.PORT || 3001)

// Connect to DB and start the server.
models.sequelize.sync()
  .then(() => {
    // Create new http server from Express app
    const server = app.listen(app.get('port'), () => {
      console.log(`Server started at port ${ server.address().port }`)
    })

    // Attach socket.io to http server
    io.attach(server, { path: '/chat' })
  })
  .catch(err => console.log('DB Error: ', err))
