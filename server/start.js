#!/usr/bin/env node

'use strict'

const { app, io } = require('../server')

app.set('port', process.env.PORT || 3000)

// Start the server
const server = app.listen(app.get('port'), () => {
  console.log(`Server started at port ${ server.address().port }`)
})

// Attach socket.io to http server
io.attach(server)
