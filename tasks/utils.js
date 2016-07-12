'use strict'

const gulp = require('gulp')
const mongoose = require('mongoose')
const User = require('../server/models/user')
const config = require('../config/server')

mongoose.Promise = global.Promise

gulp.task('list-users', function (done) {
  const argv = require('yargs').argv

  mongoose.connect(config.database)

  User.find({})
    .then(users => {
      users.forEach(user => {
        console.log(`id: ${ user.id }, username: ${ user.username }, password: ${ user.password }`)
      })
      process.exit()
    })
    .catch(err => {
      console.log('Error: ', err)
      process.exit(1)
    })

  done()
})

// gulp create-user --username admin --password password --email me@blah.com --admin true
gulp.task('create-user', function (done) {
  const argv = require('yargs').argv

  mongoose.connect(config.database)

  const user = new User({
    username: argv.username,
    password: argv.password,
    email: argv.email,
    isAdmin: argv.admin
  })

  user.save()
    .then(user => {
      console.log(`User ${ argv.username } created.`)
      process.exit()
    })
    .catch(err => {
      console.log('Error: ', err)
      process.exit(1)
    })

  done()
})

gulp.task('remove-user', function (done) {
  const argv = require('yargs').argv

  mongoose.connect(config.database)

  User.findOne({ username: argv.username })
    .then(user => user.remove())
    .then(user => {
      console.log(`User ${ argv.username } removed.`)
      process.exit()
    })
    .catch(err => {
      console.log('Error: ', err)
      process.exit(1)
    })

  done()
})
