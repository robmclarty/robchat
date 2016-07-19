'use strict'

const { createError, BAD_REQUEST } = require('../helpers/error_helper')
const User = require('../models/user')
const Friendship = require('../models/friendship')
const cred = require('../cred')

// TODO: Don't send entire user object when referenced as a friend, instead
// only send back user approved public attributes.

// GET /users/:id/friends
const getFriends = (req, res, next) => {
  User.findById(req.params.id)
    .populate('relationships.friends')
    .then(user => user.relationships.friends)
    .then(users => res.json({
      message: 'Friends found.',
      users
    }))
    .catch(next)
}

// GET /users/:user_id/friends/:id
const getFriend = (req, res, next) => {
  Promise.all([
    User.findById(req.params.user_id),
    User.findById(req.params.id)
  ])
    .then(users => {
      const user = users[0];
      const friend = users[1];

      if (!user.relationships.friends.includes(friend._id)) throw createError({
        status: BAD_REQUEST,
        message: 'This user is not your friend.'
      })

      return friend
    })
    .then(user => res.json({
      message: 'Friend found.',
      user
    }))
    .catch(next)
}

// POST /users/:user_id/friends/:id
// :user_id is requesting to be friends with :id
// TODO: move a lot of these validation checks into their own functions on the
// user model
const requestFriendship = (req, res, next) => {
  Promise.all([
    User.findById(req.params.user_id),
    User.findById(req.params.id)
  ])
    .then(users => {
      const requester = users[0];
      const requested = users[1];

      if (requester.relationships.friends.includes(requested._id)) throw createError({
        status: BAD_REQUEST,
        message: 'This user is already your friend.'
      })

      if (requested.relationships.friendRequests.includes(requested._id)) throw createError({
        status: BAD_REQUEST,
        message: 'You have already requested to be friends. Acceptance is still pending.'
      })

      if (requested.relationships.bannedFriends.includes(requester._id)) throw createError({
        status: BAD_REQUEST,
        message: 'You have been banned by this user. You cannot be friends.'
      })

      requested.relationships.friendRequests.push(requester)

      return requested.save()
    })
    .then(user => res.json({
      message: 'Friend request sent.'
    }))
    .catch(next)
}

// PUT /users/:user_id/friends/:id
// :user_id is accepting to be friends with :id (:id should already be in
// :user_id's friendRequests)
const acceptFriendship = (req, res, next) => {
  Promise.all([
    User.findById(req.params.user_id),
    User.findById(req.params.id)
  ])
    .then(users => {
      const requested = users[0];
      const requester = users[1];

      if (!requested.relationships.friendRequests.includes(requester._id)) throw createError({
        status: BAD_REQUEST,
        message: 'You currently have no friend request with that id.'
      })

      if (requested.relationships.friends.includes(requester._id)) throw createError({
        status: BAD_REQUEST,
        message: 'This user is already your friend.'
      })

      requested.relationships.friends.push(requester)
      requester.relationships.friends.push(requested)
      requested.relationships.friendRequests.remove(requester)

      return Promise.all([
        requested.save(),
        requester.save()
      ])
    })
    .then(users => res.json({
      message: 'Friend request accepted.',
      user: users[0]
    }))
    .catch(next)
}

// DELETE /users/:user_id/friends/:id
const removeFriendship = (req, res, next) => {
  const friendId = req.params.id

  User.findById(req.params.user_id)
    .then(user => {
      if (!user.relationships.friends.includes(friendId)) throw createError({
        status: BAD_REQUEST,
        message: 'You are currently not friends with this user.'
      })

      user.relationships.friends.remove(friendId)

      return user.save()
    })
    .then(user => res.json({
      message: 'Friend removed.',
      user
    }))
    .catch(next)
}

const banFriendship = (req, res, next) => {
}

const removeBan = (req, res, next) => {
}

Object.assign(exports, {
  getFriends,
  getFriend,
  requestFriendship,
  acceptFriendship,
  removeFriendship,
  banFriendship,
  removeBan
})
