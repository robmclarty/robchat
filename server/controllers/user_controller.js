'use strict'

const { createError, BAD_REQUEST } = require('../helpers/error_helper')
const User = require('../models/user')
const cred = require('../cred')

const postUsers = (req, res, next) => {
  const user = User.updatedUser({
    auth: req[cred.key].payload,
    targetUser: new User(),
    updates: req.body
  })

  user.save()
    .then(res.json({
      success: true,
      message: 'User created.',
      user: newUser
    }))
    .catch(next)
}

// Create a new user that is guaranteed to not be an admin. This is to be used
// for public-facing signup/registration with the app.
const postRegistration = (req, res, next) => {
  const user = User.updatedUser({
    auth: req[cred.key].payload,
    targetUser: new User(),
    updates: req.body
  })

  // Admin users cannot be created through this endpoint.
  newUser.isAdmin = false

  user.save()
    .then(res.json({
      success: true,
      message: 'Registration successful.',
      user: newUser
    }))
    .catch(next)
}

const getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.json({
      success: true,
      message: 'Users found.',
      users
    }))
    .catch(next)
}

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) throw createError({
        status: BAD_REQUEST,
        message: `No user found with id '${ req.params.id }'`
      })

      res.json({
        success: true,
        message: 'User found.',
        user
      })
    })
    .catch(next)
}

// Only allow updating of specific fields, check for their existence explicitly,
// and strip any html tags from String fields to mitigate XSS attacks.
const putUser = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) throw createError({
        status: BAD_REQUEST,
        message: `No user found with id '${ req.params.id }'`
      })

      return User.updatedUser({
        auth: req[cred.key].payload,
        targetUser: user,
        updates: req.body
      })
    })
    .then(user => user.save())
    .then(user => res.json({
      success: true,
      message: 'User updated.',
      user
    }))
    .catch(next)
}

const deleteUser = (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      if (!user) throw createError({
        status: BAD_REQUEST,
        message: `No user found with id '${ req.params.id }'`
      })

      res.json({
        success: true,
        message: 'User deleted.',
        user
      })
    })
    .catch(next)
}


Object.assign(exports, {
  postUsers,
  postRegistration,
  getUsers,
  getUser,
  putUser,
  deleteUser
})
