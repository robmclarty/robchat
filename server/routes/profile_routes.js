'use strict'

const router = require('express').Router()
const {
  postProfiles,
  getProfiles,
  getProfile,
  putProfile,
  deleteProfile
} = require('../controllers/profile_controller')
const {
  requireReadProfiles,
  requireWriteProfiles
} = require('../middleware/auth_middleware')

// Only admins can create new users and list all users.
router.route('/profiles')
  .post(requireWriteProfiles, postProfiles)
  .get(requireReadProfiles, getProfiles)

// Users can only get and change data for themselves, not any other users.
router.route('/profiles/:id')
  .get(requireReadProfiles, getProfile)
  .put(requireWriteProfiles, putProfile)
  .delete(requireWriteProfiles, deleteProfile)

module.exports = router
