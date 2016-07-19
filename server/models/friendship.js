'use strict'

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  BANNED: 'banned',
  REMOVED: 'removed'
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
const FriendshipSchema = new mongoose.Schema({
  requesterId: { type: ObjectId, ref: 'User', required: true, index: true },
  requestedId: { type: ObjectId, ref: 'User', required: true, index: true },
  status: {
    type: String,
    enum: Object.keys(STATUS).map(key => STATUS[key]),
    required: true,
    default: STATUS.PENDING
  },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  acceptedAt: { type: Date, required: false },
  removedAt: { type: Date, required: false }
})

// const changeFriendship = (user1, user2, status) => {
// }
//
// const requestFriend = (user1, user2, cb) => {
// }
//
// const acceptFriend = (user1, user2, cb) => {
// }
//
// const getFriends = status => {
// }
//
// const removeFriend = (user1, user2, cb) => {
// }

Object.assign(FriendshipSchema.statics, {
  STATUS
})

module.exports = mongoose.model('Friendship', FriendshipSchema)
