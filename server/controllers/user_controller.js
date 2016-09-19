'use strict'

const striptags = require('striptags')
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
// const postRegistration = (req, res, next) => {
//   const username = striptags(req.body.username)
//   const email = striptags(req.body.email)
//   const password = req.body.password
//
//   User.findOne({ email })
//     .then(user => {
//       if (user) throw createError({
//         status: BAD_REQUEST,
//         message: `The email your provided is already registered to an account.`
//       })
//
//       const newUser = new User({
//         username,
//         email,
//         password,
//         isActive: true,
//         isAdmin: false
//       })
//
//       return newUser.save()
//     })
//     .then(user => {
//       // TODO: verify email after signup is complete
//       res.json({
//         success: true,
//         message: 'New account created successfully.',
//         user
//       })
//     })
//     .catch(next)
// }

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
  req.checkParams('id', 'Not a valid user id').isMongoId()

  User.findById(req.params.id)
    .populate({
      path: 'friends friendRequests bannedFriends',
      select: 'id username'
    })
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
  req.checkParams('id', 'Not a valid user id').isMongoId()
  req.sanitizeBody().escape()

  const auth = req[cred.key].payload
  const updates = req.body

  User.findById(req.params.id)
    .then(user => {
      if (!user) throw createError({
        status: BAD_REQUEST,
        message: `No user found with id '${ req.params.id }'`
      })

      if (updates.hasOwnProperty('username')) user.set('username', striptags(updates.username))
      if (updates.hasOwnProperty('email')) user.set('email', striptags(updates.email))
      if (updates.hasOwnProperty('password')) user.set('password', updates.password)

      // Only admins can activate or de-activate users.
      if (updates.hasOwnProperty('isActive') && auth.isAdmin) user.set('isActive', updates.isActive)

      // Only other admins can assign admin status to users.
      if (updates.hasOwnProperty('isAdmin') && auth.isAdmin) user.set('isAdmin', updates.isAdmin)

      return user.save()
    })
    .then(user => res.json({
      success: true,
      message: 'User updated.',
      user
    }))
    .catch(next)
}

const deleteUser = (req, res, next) => {
  req.checkParams('id', 'Not a valid user id').isMongoId()

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

module.exports = {
  postUsers,
  //postRegistration,
  getUsers,
  getUser,
  putUser,
  deleteUser
}
