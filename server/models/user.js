'use strict'

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const argon2 = require('argon2')
const URLSafe = require('urlsafe-base64')
const striptags = require('striptags')
const Friendship = require('./friendship')

const SALT_LENGTH = 32

const ARGON2_OPTIONS = {
  timeCost: 3,
  memoryCost: 12, // 2^12kb
  parallelism: 1, // threads
  argon2d: false // use agron2i
}

// Simple validation regex for email addresses. It just checks for '@' and '.'.
// Anything more than this is overkill imho and fails to capture new and emerging
// address schemas (e.g., ending in '.ninja', or including tags with a '+').
//
// If it is crucial that email addresses are verified as real email addresses,
// rather than using some convoluted and impossible-to-understand regex, simply
// send the user a confirmation email to the would-be address directly. If it
// gets confirmed, it must be real ;)
const isValidEmail = () => (/.+@.+\..+/i)

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    sparse: true,
    validate: {
      validator: URLSafe.validate,
      message: 'must be URL-safe (use hyphens instead of spaces, like "my-cool-username")'
    }
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    required: true,
    validate: {
      validator: isValidEmail,
      message: '{ VALUE } is not a valid email address.'
    }
  },

  isActive: { type: Boolean, required: true, default: true },
  isAdmin: { type: Boolean, required: true, default: false },

  friends: [{ type: ObjectId, ref: 'User' }],
  friendRequests: [{ type: ObjectId, ref: 'User' }],
  favorites: [{ type: ObjectId, ref: 'User' }],
  bannedFriends: [{ type: ObjectId, ref: 'User' }],

  loginAt: { type: Date, required: true, default: Date.now },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
})

// Keep updatedAt current on each save.
UserSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

// Convert password as argon2 hash before saving it.
UserSchema.pre('save', function (next) {
  const user = this

  // Break out if the password hasn't changed.
  if (!user.isModified('password')) return next()

  // If password has changed, hash it before saving to the database.
  argon2.generateSalt(SALT_LENGTH)
    .then(salt => argon2.hash(user.password, salt, ARGON2_OPTIONS))
    .then(hash => {
      user.password = hash
      next()
    })
    .catch(next)
})

const verifyPassword = function (password) {
  return new Promise((resolve, reject) => {
    argon2.verify(this.password, password)
      .then(match => resolve(match))
      .catch(err => reject(err))
  })
}

// Generate limited data object for use in JWT token payload.
const tokenPayload = function () {
  return {
    userId: this.id,
    username: this.username,
    email: this.email,
    isActive: this.isActive,
    isAdmin: this.isAdmin,
    permissions: {}
  }
}

// More data returned in JSON form than in token payload.
const toJSON = function () {
  return {
    id: this.id,
    username: this.username,
    email: this.email,

    isActive: this.isActive,
    isAdmin: this.isAdmin,

    friends: this.friends,
    friendRequests: this.friendRequests,
    favorites: this.favorites,
    bannedFriends: this.bannedFriends,

    loginAt: this.loginAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

Object.assign(UserSchema.methods, {
  verifyPassword,
  tokenPayload,
  toJSON
})

// Given a user object, check for any corresponding attributes in the updates
// modify the user object that are allowed by the properties of the auth object.
const updatedUser = ({ auth = {}, targetUser = {}, updates = {} }) => {
  const user = Object.assign({}, targetUser)

  if (updates.hasOwnProperty('username')) user.username = striptags(updates.username)
  if (updates.hasOwnProperty('email')) user.email = striptags(updates.email)
  if (updates.hasOwnProperty('password')) user.password = updates.password

  // Only admins can activate or de-activate users.
  if (updates.hasOwnProperty('isActive') && auth.isAdmin) user.isActive = updates.isActive

  // Only other admins can assign admin status to users.
  if (updates.hasOwnProperty('isAdmin') && auth.isAdmin) user.isAdmin = updates.isAdmin

  return user
}

Object.assign(UserSchema.statics, {
  updatedUser
})

module.exports = mongoose.model('User', UserSchema)
