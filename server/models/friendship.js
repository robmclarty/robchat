'use strict'

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const User = require('./user')

const STATUS = {
  PENDING: 'pending',
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  REJECTED: 'rejected',
  BANNED: 'banned'
}

// inspired by https://github.com/numbers1311407/mongoose-friends
//
// Requesting a new friendship creates 2 friendship records (one for each
// friend). The first one will have status "requested", the second will have
// status "pending". When someone accepts a newly requested friendship, they
// will trigger a change of status for both friendship records. First, they will
// change the status of their own "pending" friendship to "accepted", and then
// they will change the status of any friendship matching friendId to their
// userId that currently has a status of "requested" to "accepted", closing the
// loop and creating a new mutually accepted friendship.
//
// 1. User A requests friendship from user B
// { userId: 'A', friendId: 'B', status: 'requested' }
// { userId: 'B', friendId: 'A', status: 'pending' }
//
// 2. User B accepts friendship from user A
// { userId: 'A', friendId: 'B', status: 'accepted' }
// { userId: 'B', friendId: 'A', status: 'accepted' }
//
// User A's friendships = Friendships.where({ friendId: userA.id, status: 'accepted' })
const FriendshipSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'User', required: true, index: true },
  friendId: { type: ObjectId, ref: 'User', required: true, index: true },
  status: {
    type: String,
    enum: Object.keys(STATUS).map(key => STATUS[key]),
    required: true,
    default: STATUS.PENDING
  },
  acceptedAt: { type: Date, required: false },
  declinedAt: { type: Date, required: false },
  rejectedAt: { type: Date, required: false },
  bannedAt: { type: Date, required: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
})

// Keep updatedAt current on each save.
FriendshipSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

const findFriendship = function (userId, friendId) {
  return this.find().or([{ userId }, { friendId }])
}

const newFriendship = function (userId, friendId, status) {
  return new this({
    userId,
    friendId,
    status
  })
}

const request = function (requester, requestee) {
  const findRequesterFriendship = findFriendship(requester.id, requestee.id)
  const findRequesteeFriendship = findFriendship(requestee.id, requester.id)

  return Promise.all([
    findRequesterFriendship,
    findRequesteeFriendship
  ])
    .then(results => {
      const requesterFriendship = newFriendship(requester.id, requestee.id, STATUS.REQUESTED)
      const requesteeFriendship = newFriendship(requestee.id, requester.id, STATUS.PENDING)

      if (results[0]) requesterFriendship = results[0]
      if (results[1]) requesteeFriendship = results[1]

      switch (requesterFriendship.status) {
        case STATUS.REJECTED:
        case STATUS.DECLINED:
          requesterFriendship.status = STATUS.REQUESTED
          break
        default:
          // do nothing if anything else
      }

      // Only update the status of removed or declined friendships, otherwise
      // banned stays banned, new pending stays pending, accepted stays
      // accepted, etc. If a request is made to an existing banned friendship,
      // automatically change the requester's status to declined.
      //
      // If a requestee has already requested friendship with the requester,
      // automatically accept both relationships as friends as they've both
      // indicated they want to be friends with each other.
      switch (requesteeFriendship.status) {
        case STATUS.REJECTED:
        case STATUS.DECLINED:
          requesteeFriendship.status = STATUS.PENDING
          break
        case STATUS.REQUESTED:
          requesterFriendship.status = STATUS.ACCEPTED
          requesteeFriendship.status = STATUS.ACCEPTED
          break
        case STATUS.BANNED:
          requesterFriendship.status = STATUS.DECLINED
          break
        default:
          // do nothing if anything else
      }

      return Promise.all([
        requesterFriendship.save(),
        requesteeFriendship.save()
      ])
    })
}

const accept = function (accepter, requester) {
  const findRequesterFriendship = findFriendship(requester.id, accepter.id)
  const findAccepterFriendship = findFriendship(accepter.id, requester.id)

  return Promise.all([
    findRequesterFriendship,
    findAccepterFriendship
  ])
    .then(results => {
      const requesterFriendship = results[0]
      const accepterFriendship = results[1]

      requesterFriendship.status = STATUS.ACCEPTED
      requesterFriendship.acceptedAt = Date.now()

      accepterFriendship.status = STATUS.ACCEPTED
      requesterFriendship.acceptedAt = Date.now()

      return Promise.all([
        requesterFriendship.save(),
        accepterFriendship.save()
      ])
    })
}

const decline = function (decliner, user) {
  const findUserFriendship = findFriendship(user.id, decliner.id)
  const findDeclinerFriendship = findFriendship(decliner.id, user.id)

  return Promise.all([
    findUserFriendship,
    findDeclinerFriendship
  ])
    .then(results => {
      const userFriendship = results[0]
      const declinerFriendship = results[1]

      userFriendship.status = STATUS.REJECTED
      userFriendship.rejectedAt = Date.now()

      declinerFriendship.status = STATUS.DECLINED
      declinerFriendship.declinedAt = Date.now()

      return Promise.all([
        userFriendship.save(),
        declinerFriendship.save()
      ])
    })
}

const ban = function (banner, user) {
  const findUserFriendship = findFriendship(user.id, banner.id)
  const findBannerFriendship = findFriendship(banner.id, user.id)

  return Promise.all([
    findUserFriendship,
    findBannerFriendship
  ])
    .then(results => {
      const userFriendship = results[0]
      const bannerFriendship = results[1]

      userFriendship.status = STATUS.REJECTED
      userFriendship.rejectedAt = Date.now()

      bannerFriendship.status = STATUS.BANNED
      bannerFriendship.bannedAt = Date.now()

      return Promise.all([
        userFriendship.save(),
        bannerFriendship.save()
      ])
    })
}

const getFriends = function (user) {
  return new Promise((resolve, reject) => {
    this.find({})
      .where({ friendId: user.id, status: STATUS.ACCEPTED })
      .then(friends => resolve(friends))
      .catch(err => reject(err))
  })
}

const getRequests = function (user) {
  return new Promise((resolve, reject) => {
    this.find({})
      .where({ userId: user.id, status: STATUS.REQUESTED })
      .then(friends => resolve(friends))
      .catch(err => reject(err))
  })
}

const getRejections = function (user) {
  return new Promise((resolve, reject) => {
    this.find({})
      .where({ userId: user.id, status: STATUS.REJECTED })
      .then(friends => resolve(friends))
      .catch(err => reject(err))
  })
}

const getDeclines = function (user) {
  return new Promise((resolve, reject) => {
    this.find({})
      .where({ userId: user.id, status: STATUS.DECLINED })
      .then(friends => resolve(friends))
      .catch(err => reject(err))
  })
}

const getBans = function (user) {
  return new Promise((resolve, reject) => {
    this.find({})
      .where({ userId: user.id, status: STATUS.BANNED })
      .then(friends => resolve(friends))
      .catch(err => reject(err))
  })
}

Object.assign(FriendshipSchema.statics, STATUS, {
  request,
  accept,
  decline,
  ban,
  getFriends,
  getRequests,
  getRejections,
  getDeclines,
  getBans
})

module.exports = mongoose.model('Friendship', FriendshipSchema)
