'use strict'

const { createError, UNAUTHORIZED } = require('../helpers/error_helper')
const User = require('../models/user')
const cred = require('../cred')

// This function assumes the request has already been processed by a cred
// authentication function and has attached "tokens" to req.cred according to
// the strategy being used. If that process hit an error or didn't authenticate
// it would have created its own error and not executed this function.
const postTokens = (req, res, next) => {
  if (!req[cred.key] || !req[cred.key].tokens)
    return next(new Error('Authentication failed.'))

  res.json({
    success: true,
    message: 'Tokens generated successfully.',
    tokens: req[cred.key].tokens
  })
}

// Takes a refresh-token (in the request header, validated in middleware), and
// returns a fresh access-token.
const putTokens = (req, res, next) => {
  cred.refresh(req[cred.key].token)
    .then(freshTokens => res.json({
      message: 'Tokens refreshed.',
      tokens: freshTokens
    }))
    .catch(next)
}

// Logging out is simply done by removing the current, valid, token from a
// whitelist which will invalidate the token. Respond that the user is now
// "logged out".
const deleteToken = (req, res, next) => {
  cred.revoke(req[cred.key].token)
    .then(revokedToken => res.json({
      message: 'Token revoked.',
      token: revokedToken
    }))
    .catch(next)
}

Object.assign(exports, {
  postTokens,
  putTokens,
  deleteToken
})
