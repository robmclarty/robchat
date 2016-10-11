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

// Attributes used to populate friend objects.
const FRIEND_ATTRIBUTES = 'id username'

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

const requestFriendship = function (user) {
  return Friendship.request(this.id, user.id)
}

const acceptFriendship = function (user) {
  return Friendship.accept(this.id, user.id)
}

const declineFriendship = function (user) {
  return Friendship.decline(this.id, user.id)
}

const banFriendship = function (user) {
  return Friendship.ban(this.id, user.id)
}

const getFriends = function () {
  return Friendship.getFriends(this.id)
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

const toFriend = function () {
  return {
    id: this.id,
    username: this.username
  }
}

Object.assign(UserSchema.methods, {
  verifyPassword,
  tokenPayload,
  requestFriendship,
  acceptFriendship,
  declineFriendship,
  banFriendship,
  getFriends,
  toJSON,
  toFriend
})

Object.assign(UserSchema.statics, {
  FRIEND_ATTRIBUTES
})

module.exports = mongoose.model('User', UserSchema)
