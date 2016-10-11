'use strict'

const { createError, BAD_REQUEST } = require('../helpers/error_helper')

const postRegister = (req, res, next) => {
  next('Registration temporarily disabled')
  // const user = User.updatedUser({
  //   auth: req[cred.key].payload,
  //   targetUser: new User(),
  //   updates: req.body
  // })
  //
  // user.save()
  //   .then(res.json({
  //     ok: true,
  //     message: 'User created.',
  //     user: newUser
  //   }))
  //   .catch(next)
}

module.exports = {
  postRegister
}
