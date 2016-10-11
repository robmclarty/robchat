'use strict'

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
  NOT_FOUND,
  UNPROCESSABLE,
  GENERIC_ERROR
} = require('../helpers/error_helper')

// Catch any Sequelize-generated errors (e.g., DB validation errors) and
// consider them "unprocessable". If the process got the point of trying to do
// something in the database, it must have at least "understood" the request,
// but was unable to process the request, hence 422 response.
const sequelizeError = (err, req, res, next) => {
  if (!err.status && err.name && err.name.includes('Sequelize')) {
    let status = UNPROCESSABLE

    // If there was a uniqueness conflict, return 409 instead of 422.
    if (err.name === 'SequelizeUniqueConstraintError') status = CONFLICT

    return res.status(status).send({
      ok: false,
      message: err.message,
      errors: err.errors ? err.errors.map(error => error.message) : [err.message]
    })
  }

  return next(err)
}

const unauthorized = (error, req, res, next) => {
  if (error.status !== UNAUTHORIZED) return next(error)

  res.status(UNAUTHORIZED).send({
    ok: false,
    message: error.message || 'Unauthorized',
    error
  })
}

const forbidden = (error, req, res, next) => {
  if (error.status !== FORBIDDEN) return next(error)

  res.status(FORBIDDEN).send({
    ok: false,
    message: error.message || 'Forbidden',
    error
  })
}

const conflict = (err, req, res, next) => {
  if (err.status !== CONFLICT) return next(err)

  res.status(CONFLICT).send({
    ok: false,
    message: err.message || 'Conflict',
    errors: [err]
  })
}

const badRequest = (error, req, res, next) => {
  if (error.status !== BAD_REQUEST) return next(error)

  res.status(BAD_REQUEST).send({
    ok: false,
    message: error.message || 'Bad Request',
    error
  })
}

const unprocessable = (error, req, res, next) => {
  if (error.status !== UNPROCESSABLE) return next(error)

  res.status(UNPROCESSABLE).send({
    ok: false,
    message: error.message || 'Unprocessable entity',
    error
  })
}

// If there's nothing left to do after all this (and there's no error),
// return a 404 error.
const notFound = (err, req, res, next) => {
  if (err.status !== NOT_FOUND) return next(err)

  res.status(NOT_FOUND).send({
    ok: false,
    message: err.message || 'The requested resource could not be found'
  })
}

// If there's still an error at this point, return a generic 500 error.
const genericError = (error, req, res, next) => {
  res.status(GENERIC_ERROR).send({
    ok: false,
    message: error.message || 'Internal server error',
    error
  })
}

// If there's nothing left to do after all this (and there's no error),
// return a 404 error.
const catchall = (req, res, next) => {
  res.status(NOT_FOUND).send({
    ok: false,
    message: 'The requested resource could not be found'
  })
}

module.exports = {
  sequelizeError,
  unauthorized,
  forbidden,
  conflict,
  badRequest,
  unprocessable,
  notFound,
  genericError,
  catchall
}
