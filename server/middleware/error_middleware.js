'use strict'

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  PAGE_NOT_FOUND,
  UNPROCESSABLE,
  GENERIC_ERROR
} = require('../helpers/error_helper')

const unauthorized = (error, req, res, next) => {
  if (error.status !== UNAUTHORIZED) return next(error)

  res.status(UNAUTHORIZED).send({
    message: error.message || 'Unauthorized.',
    error
  })
}

const forbidden = (error, req, res, next) => {
  if (error.status !== FORBIDDEN) return next(error)

  res.status(FORBIDDEN).send({
    message: error.message || 'Forbidden.',
    error
  })
}

const badRequest = (error, req, res, next) => {
  if (error.status !== BAD_REQUEST) return next(error)

  res.status(BAD_REQUEST).send({
    message: error.message || 'Bad Request',
    error
  })
}

const unprocessable = (error, req, res, next) => {
  if (error.status !== UNPROCESSABLE) return next(error)

  res.status(UNPROCESSABLE).send({
    message: error.message || 'Unprocessable entity.',
    error
  })
}

// If there's still an error at this point, return a generic 500 error.
const genericError = (error, req, res, next) => {
  res.status(GENERIC_ERROR).send({
    message: error.message || 'Internal server error.',
    error
  })
}

// If there's nothing left to do after all this (and there's no error),
// return a 404 error.
const pageNotFound = (req, res, next) => {
  res.status(PAGE_NOT_FOUND).send({
    message: 'Page not found.'
  })
}

module.exports = {
  unauthorized,
  forbidden,
  badRequest,
  unprocessable,
  genericError,
  pageNotFound
}
