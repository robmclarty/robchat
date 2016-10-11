'use strict'

const cred = require('../cred')

const isAdmin = req =>
  req.cred &&
  req.cred.payload &&
  req.cred.payload.isAdmin

const isOwner = req =>
  req.cred &&
  req.cred.payload &&
  req.cred.payload.userId &&
  req.params &&
  req.params.userId &&
  Number(req.cred.payload.userId) === Number(req.params.userId)

const isAdminOrOwner = req => isAdmin(req) || isOwner(req)

// Profiles
// --------
// If admin or owner, pass through, otherwise require permission 'profiles:read'.
const requireReadProfiles = (req, res, next) => isAdminOrOwner(req) ?
  next() :
  cred.requirePermission('profiles:read')

// If admin or owner, pass through, otherwise require permission 'profiles:write'.
const requireWriteProfiles = (req, res, next) => isAdminOrOwner(req) ?
  next() :
  cred.requirePermission('profiles:write')

// Relationships
// -------------
const requireReadFriends = (req, res, next) => isAdminOrOwner(req) ?
  next() :
  cred.requirePermission('friends:read')

const requireWriteFriends = (req, res, next) => isAdminOrOwner(req) ?
  next() :
  cred.requirePermission('friends:write')

// Chat
// ----
const requireChat = (req, res, next) => isAdminOrOwner(req) ?
  next() :
  cred.requirePermission('chat')

module.exports = {
  isAdmin,
  isOwner,
  isAdminOrOwner,
  requireReadProfiles,
  requireWriteProfiles,
  requireReadFriends,
  requireWriteFriends,
  requireChat
}
