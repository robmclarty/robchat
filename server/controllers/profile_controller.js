'use strict'

const { createError, NOT_FOUND } = require('../helpers/error_helper')
const { Profile } = require('../models')

const findProfileById = profileId => Profile.findById(profileId)
  .then(profile => {
    if (!profile) throw createError({
      status: NOT_FOUND,
      message: `No profile found with the id '${ profileId }'`
    })

    return profile
  })

const findProfileByUserId = userId => Profile.findOne({ where: { userId } })
  .then(profile => {
    if (!profile) throw createError({
      status: NOT_FOUND,
      message: `No profile found with the id '${ profileId }'`
    })

    return profile
  })

// POST /profiles
const postProfiles = (req, res, next) => {
  Profile.create(req.body)
    .then(profile => res.json({
      ok: true,
      message: 'Profile created',
      profile
    }))
    .catch(next)
}

// GET /profiles
const getProfiles = (req, res, next) => {
  Profile.findAll()
    .then(profiles => res.json({
      ok: true,
      message: 'Profiles found',
      profiles
    }))
    .catch(next)
}

// If there is currently no profile for this userId, create a new empty profile
// immediately and return that.
// GET /profiles/:userId
const getProfile = (req, res, next) => {
  const userId = req.params.userId

  console.log('userid: ', userId)

  Profile.findOne({ where: { userId } })
    .then(profile => {
      return !profile ?
        Profile.create({ userId }) :
        profile
    })
    .then(profile => res.json({
      ok: true,
      message: 'Profile found',
      profile
    }))
    .catch(next)
}

// PUT /profiles/:userId
const putProfile = (req, res, next) => {
  const userId = req.params.userId

  findProfileByUserId(userId)
    .then(profile => profile.update(req.body))
    .then(profile => res.json({
      ok: true,
      message: 'Profile updated',
      profile
    }))
    .catch(next)
}

// DELETE /profiles/:userId
const deleteProfile = (req, res, next) => {
  const userId = req.params.userId

  findProfileById(userId)
    .then(profile => profile.destroy())
    .then(profile => res.json({
      ok: true,
      message: 'Profile deleted'
    }))
    .catch(next)
}

module.exports = {
  getProfiles,
  postProfiles,
  getProfile,
  putProfile,
  deleteProfile
}
