'use strict'

const striptags = require('striptags')
const { createError, BAD_REQUEST } = require('../helpers/error_helper')
const User = require('../models/user')
const cred = require('../cred')

const postProfiles = (req, res, next) => {
  const user = User.updatedUser({
    auth: req[cred.key].payload,
    targetUser: new User(),
    updates: req.body
  })

  user.save()
    .then(res.json({
      ok: true,
      message: 'User created.',
      user: newUser
    }))
    .catch(next)
}

const getProfiles = (req, res, next) => {
  User.find({})
    .then(users => res.json({
      ok: true,
      message: 'Users found.',
      users
    }))
    .catch(next)
}

const getProfile = (req, res, next) => {
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
        ok: true,
        message: 'User found.',
        user
      })
    })
    .catch(next)
}

// Only allow updating of specific fields, check for their existence explicitly,
// and strip any html tags from String fields to mitigate XSS attacks.
const putProfile = (req, res, next) => {
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
      ok: true,
      message: 'User updated.',
      user
    }))
    .catch(next)
}

const deleteProfile = (req, res, next) => {
  req.checkParams('id', 'Not a valid user id').isMongoId()

  User.findByIdAndRemove(req.params.id)
    .then(user => {
      if (!user) throw createError({
        status: BAD_REQUEST,
        message: `No user found with id '${ req.params.id }'`
      })

      res.json({
        ok: true,
        message: 'User deleted.',
        user
      })
    })
    .catch(next)
}

module.exports = {
  postProfiles,
  getProfiles,
  getProfile,
  putProfile,
  deleteProfile
}
