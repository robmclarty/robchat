'use strict'

const { readFileSync } = require('fs')
const gotCred = require('cred')
const config = require('../config/server')
//const User = require('./models/user')

const cred = gotCred({
  resource: config.appName,
  issuer: config.issuer,
  accessOpts: {
    publicKey: readFileSync(config.publicKeyPath),
    algorithm: config.algorithm
  }
}, true)

// Find a user matching 'req.body.username', verify its password, and if it is
// authentic, return a token payload for that user. No need to catch error here
// (just trow them) as they will be handled by cred itself and passed to your
// error handling middleware from there.
// cred.use('basic', req => {
//   console.log('req: ', req.body)
//   return User.findOne({ username: req.body.username })
//     .then(user => {
//       if (!user) throw 'username or password do not match'
//
//       return Promise.all([user, user.verifyPassword(req.body.password)])
//     })
//     .then(userMatch => {
//       const user = userMatch[0]
//       const isMatch = userMatch[1]
//
//       if (!isMatch) throw 'username or password do not match'
//
//       return user
//     })
//     .then(user => user.tokenPayload())
// })

module.exports = cred
