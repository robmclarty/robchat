'use strict'

const router = require('express').Router()
const {
  postUsers,
  getUsers,
  getUser,
  putUser,
  deleteUser
} = require('../controllers/user_controller')

// Only admins can create new users and list all users.
router.route('/users')
  .post(postUsers)
  .get(getUsers)

// Users can only get and change data for themselves, not any other users.
router.route('/users/:id')
  .get(getUser)
  .put(putUser)
  .delete(deleteUser)

module.exports = router
