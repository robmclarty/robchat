'use strict'

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

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
  requestedAt: { type: Date, required: false },
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
  console.log('requesterId: ', userId)
  console.log('targetId: ', friendId)
  console.log('this: ', this)
  return this.findOne().and([{ userId }, { friendId }])
}

const newFriendship = function (userId, friendId, status) {
  return new this({
    userId,
    friendId,
    status
  })
}

const request = function (requesterId, targetId) {
  const findRequesterFriendship = this.findFriendship(requesterId, targetId)
  const findTargetFriendship = this.findFriendship(targetId, requesterId)

  return Promise.all([
    findRequesterFriendship,
    findTargetFriendship
  ])
    .then(results => {
      // If there was an existing friendship already created, use that,
      // otherwise create a new one.
      const requesterFriendship = results[0] ?
        results[0] :
        this.newFriendship(requesterId, targetId, STATUS.REQUESTED)
      const targetFriendship = results[1] ?
        results[1] :
        this.newFriendship(targetId, requesterId, STATUS.PENDING)

      // Regardless of the requester's friendship status, set it to "requested"
      // for this new request. This status will be overriden by other statuses
      // depending on what the status of the target's friendship is (e.g., if
      // target banned requester, it will be overriden to "rejected").
      requesterFriendship.status = STATUS.REQUESTED
      requesterFriendship.requestedAt = Date.now()

      // Only update the status of removed or declined friendships, otherwise
      // banned stays banned, new pending stays pending, accepted stays
      // accepted, etc. If a request is made to an existing banned friendship,
      // automatically change the requester's status to declined.
      //
      // If a target has already requested friendship with the requester,
      // automatically accept both relationships as friends as they've both
      // indicated they want to be friends with each other.
      switch (targetFriendship.status) {
      case STATUS.REJECTED:
      case STATUS.DECLINED:
        targetFriendship.status = STATUS.PENDING
        break
      case STATUS.REQUESTED:
        requesterFriendship.status = STATUS.ACCEPTED
        requesterFriendship.acceptedAt = Date.now()
        targetFriendship.status = STATUS.ACCEPTED
        targetFriendship.acceptedAt = Date.now()
        break
      case STATUS.BANNED:
        requesterFriendship.status = STATUS.REJECTED
        requesterFriendship.rejectedAt = Date.now()
        break
      default:
        // do nothing if anything else
      }

      return Promise.all([
        requesterFriendship.save(),
        targetFriendship.save()
      ])
    })
}

const accept = function (accepterId, requesterId) {
  const findRequesterFriendship = this.findFriendship(requesterId, accepterId)
  const findAccepterFriendship = this.findFriendship(accepterId, requesterId)

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

// NOTE: I'm using "targetId" for the following functions rather than "friendId"
// to avoid confusion with the actual friendId field used in the model itself
// which is not necessarily the targetId here.
const decline = function (declinerId, targetId) {
  const findTargetFriendship = this.findFriendship(targetId, declinerId)
  const findDeclinerFriendship = this.findFriendship(declinerId, targetId)

  return Promise.all([
    findTargetFriendship,
    findDeclinerFriendship
  ])
    .then(results => {
      const targetFriendship = results[0]
      const declinerFriendship = results[1]

      targetFriendship.status = STATUS.REJECTED
      targetFriendship.rejectedAt = Date.now()

      declinerFriendship.status = STATUS.DECLINED
      declinerFriendship.declinedAt = Date.now()

      return Promise.all([
        targetFriendship.save(),
        declinerFriendship.save()
      ])
    })
}

const ban = function (bannerId, targetId) {
  const findTargetFriendship = this.findFriendship(targetId, bannerId)
  const findBannerFriendship = this.findFriendship(bannerId, targetId)

  return Promise.all([
    findTargetFriendship,
    findBannerFriendship
  ])
    .then(results => {
      const targetFriendship = results[0]
      const bannerFriendship = results[1]

      targetFriendship.status = STATUS.REJECTED
      targetFriendship.rejectedAt = Date.now()

      bannerFriendship.status = STATUS.BANNED
      bannerFriendship.bannedAt = Date.now()

      return Promise.all([
        targetFriendship.save(),
        bannerFriendship.save()
      ])
    })
}

const getFriends = function (userId) {
  return new Promise((resolve, reject) => {
    this.find({ userId, status: STATUS.ACCEPTED })
      .populate('userId')
      .then(friendships => friendships.map(friendship => friendship.userId))
      .then(users => resolve(users))
      .catch(err => reject(err))
  })
}

const getRequests = function (userId) {
  return new Promise((resolve, reject) => {
    this.find({ userId, status: STATUS.REQUESTED })
      .then(friendships => resolve(friendships))
      .catch(err => reject(err))
  })
}

const getRejections = function (userId) {
  return new Promise((resolve, reject) => {
    this.find({ userId, status: STATUS.REJECTED })
      .then(friendships => resolve(friendships))
      .catch(err => reject(err))
  })
}

const getDeclines = function (userId) {
  return new Promise((resolve, reject) => {
    this.find({ userId, status: STATUS.DECLINED })
      .then(friendships => resolve(friendships))
      .catch(err => reject(err))
  })
}

const getBans = function (userId) {
  return new Promise((resolve, reject) => {
    this.find({ userId, status: STATUS.BANNED })
      .then(friendships => resolve(friendships))
      .catch(err => reject(err))
  })
}

// Find and sort all friendships for userId. This is useful as a onetime request
// of all relationship data for a user, for example, for populating the
// front-end state.
const getRelationships = function (userId) {
  const defaultRelationships = {
    friends: [],
    requests: [],
    pending: [],
    rejections: [],
    declines: [],
    bans: []
  }

  return new Promise((resolve, reject) => {
    this.find({ userId })
      .populate('friendId', this.model('User').FRIEND_ATTRIBUTES)
      .then(friendships => friendships.reduce((relationships, friendship) => {
        const friend = friendship.friendId.toFriend()

        switch (friendship.status) {
        case STATUS.PENDING:
          relationships.pending.push(Object.assign({}, friend, {
            createdAt: friendship.createdAt
          }))
          break
        case STATUS.ACCEPTED:
          relationships.friends.push(Object.assign({}, friend, {
            acceptedAt: friendship.acceptedAt
          }))
          break
        case STATUS.REQUESTED:
          relationships.requests.push(Object.assign({}, friend, {
            requestedAt: friendship.requestedAt
          }))
          break
        case STATUS.REJECTED:
          relationships.rejections.push(Object.assign({}, friend, {
            rejectedAt: friendship.rejectedAt
          }))
          break
        case STATUS.DECLINED:
          relationships.declines.push(Object.assign({}, friend, {
            declinedAt: friendship.declinedAt
          }))
          break
        case STATUS.BANNED:
          relationships.bans.push(Object.assign({}, friend, {
            bannedAt: friendship.bannedAt
          }))
          break
        default:
          // do nothing
        }

        return relationships
      }, defaultRelationships))
      .then(resolve)
      .catch(reject)
  })
}

Object.assign(FriendshipSchema.statics, STATUS, {
  request,
  accept,
  decline,
  ban,
  getRelationships,
  getFriends,
  getRequests,
  getRejections,
  getDeclines,
  getBans,
  findFriendship,
  newFriendship
})

module.exports = mongoose.model('Friendship', FriendshipSchema)
