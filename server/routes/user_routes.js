'use strict'

const router = require('express').Router()
const {
  postUsers,
  getUsers,
  getUser,
  putUser,
  deleteUser,
  postRegistration
} = require('../controllers/user_controller')
const cred = require('../cred')

const isAdmin = req =>
  req.cred &&
  req.cred.payload &&
  req.cred.payload.isAdmin

const requireAdmin = (req, res, next) => isAdmin(req) ?
  next() :
  next('Unauthorized')

const requireOwner = (req, res, next) =>
  req.cred &&
  req.cred.payload &&
  req.params &&
  req.params.id &&
  (req.cred.payload.userId === req.params.id || req.cred.payload.isAdmin) ?
    next() :
    next('Unauthorized')

// Use "registration" resource to handle signups. This is separate from creating
// a "user" resource from the user_controller in that it is public-facing and
// can be made more limited. It is to be used as part of a signup/registration
// process which goes hand-in-hand with the above authentication routes.
// Creating a user from the user_controller can then be reserved for different
// purposes such as internal administration.
router.route('/registration')
  .post(postRegistration)

// Only admins can create new users and list all users.
router.route('/users')
  .all([cred.requireAccessToken, requireAdmin])
  .post(postUsers)
  .get(getUsers)

// Users can only get and change data for themselves, not any other users.
router.route('/users/:id')
  .all(cred.requireAccessToken)
  .get(requireOwner, getUser)
  .put(requireOwner, putUser)
  .delete(requireAdmin, deleteUser)

module.exports = router
