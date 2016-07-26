'use strict'

const {
  createError,
  BAD_REQUEST,
  UNPROCESSABLE,
  FORBIDDEN
} = require('../helpers/error_helper')
const User = require('../models/user')
const Friendship = require('../models/friendship')
const cred = require('../cred')

// TODO: Don't send entire user object when referenced as a friend, instead
// only send back user approved public attributes.

// GET /users/:id/relationships
const getRelationships = (req, res, next) => {
  Friendship.getRelationships(req.params.id)
    .then(relationships => res.json({
      message: 'Relationships found.',
      relationships
    }))
    .catch(next)
}

// GET /users/:id/friends
const getFriends = (req, res, next) => {
  Friendship.getFriends(res.params.id)
    .then(users => res.json({
      message: 'Friends found.',
      users
    }))
    .catch(next)

  // User.findById(req.params.id)
  //   .populate('friends', 'id username')
  //   .then(user => user.friends)
  //   .then(users => res.json({
  //     message: 'Friends found.',
  //     users
  //   }))
  //   .catch(next)
}

// GET /users/:user_id/friends/:id
const getFriend = (req, res, next) => {
  const userId = req.params.user_id
  const friendId = req.params.id

  Friendship.findOne({
    userId: friendId,
    friendId: userId,
    status: Friendship.ACCEPTED
  })
    .populate('userId')
    .then(friendship => {
      if (!friendship) throw createError({
        status: FORBIDDEN,
        message: 'This user is not your friend.'
      })

      return friendship.userId
    })
    .then(user => res.json({
      message: 'Found friend.',
      user
    }))
    .catch(next)

  // Promise.all([
  //   User.findById(req.params.user_id),
  //   User.findById(req.params.id)
  // ])
  //   .then(users => {
  //     const user = users[0];
  //     const friend = users[1];
  //
  //     const friends = user.friends.map(id => String(id))
  //
  //     if (!friends.includes(friend.id)) throw createError({
  //       status: FORBIDDEN,
  //       message: 'This user is not your friend.'
  //     })
  //
  //     return friend
  //   })
  //   .then(user => res.json({
  //     message: 'Friend found.',
  //     user
  //   }))
  //   .catch(next)
}

// POST /users/:id/friends
// :user_id is requesting to be friends with body: { username }
// TODO: move a lot of these validation checks into their own functions on the
// user model
const requestFriendship = (req, res, next) => {
  if (!req.body.username) return next(createError({
    status: BAD_REQUEST,
    message: 'No username provided from which to request friendship.'
  }))

  Promise.all([
    User.findById(req.params.id),
    User.findOne({ username: req.body.username }).select(User.FRIEND_ATTRIBUTES)
  ])
    .then(users => {
      const requester = users[0];
      const target = users[1];

      if (!target) throw createError({
        status: BAD_REQUEST,
        message: `No user found with username '${ target.username }'`
      })

      if (!requester) throw createError({
        status: BAD_REQUEST,
        message: `No user found with id ${ requester.id }`
      })

      // Requesting a friendship this way with no other error handling will not
      // alert the requester if the requestee has banned or already declined
      // them. This way, the requestee's privacy regarding his or her feelings
      // about being friends with the requester is obscured.
      return Promise.all([
        target,
        Friendship.request(requester.id, target.id)
      ])

      // Map mongoose array of ObjectIds to array of strings for comparisons.
      // const requesterFriends = requester.friends.map(id => String(id))
      // const requestedFriendRequests = requested.friendRequests.map(id => String(id))
      // const requestedBannedFriends = requested.bannedFriends.map(id => String(id))
      //
      // if (requesterFriends.includes(requested.id)) throw createError({
      //   status: UNPROCESSABLE,
      //   message: 'This user is already your friend.'
      // })
      //
      // if (requestedFriendRequests.includes(requester.id)) throw createError({
      //   status: UNPROCESSABLE,
      //   message: 'You have already requested to be friends. Acceptance is still pending.'
      // })
      //
      // if (requestedBannedFriends.includes(requester.id)) throw createError({
      //   status: FORBIDDEN,
      //   message: 'You have been banned by this user. You cannot be friends.'
      // })
      //
      // requested.friendRequests.push(requester)
      //
      // return requested.save()
    })
    .then(results => {
      const target = results[0];
      const friendship = results[1];

      res.json({
        message: 'Friend request sent.',
        friend: Object.assign({}, target, {
          requestedAt: friendship.requestedAt
        })
      })
    })
    .catch(next)
}

// PUT /users/:user_id/friends/:id
// :user_id is accepting to be friends with :id (:id should already be in
// :user_id's friendRequests)
const acceptFriendship = (req, res, next) => {
  const accepterId = req.params.user_id
  const requesterId = req.params.id

  Friendship.accept(accepterId, requesterId)
    .then(friendships => res.json({
      message: 'Friendship accepted'
    }))
    .catch(next)

  // Promise.all([
  //   User.findById(req.params.user_id),
  //   User.findById(req.params.id)
  // ])
  //   .then(users => {
  //     const requested = users[0];
  //     const requester = users[1];
  //
  //     const requestedFriendRequests = requested.friendRequests.map(id => String(id))
  //     const requestedFriends = requested.friends.map(id => String(id))
  //
  //     if (!requestedFriendRequests.includes(requester.id)) throw createError({
  //       status: BAD_REQUEST,
  //       message: 'You currently have no friend request with that id.'
  //     })
  //
  //     if (requestedFriends.includes(requester.id)) throw createError({
  //       status: UNPROCESSABLE,
  //       message: 'This user is already your friend.'
  //     })
  //
  //     requested.friends.push(requester)
  //     requester.friends.push(requested)
  //     requested.friendRequests.remove(requester)
  //
  //     return Promise.all([
  //       requested.save(),
  //       requester.save()
  //     ])
  //   })
  //   .then(users => res.json({
  //     message: 'Friend request accepted.',
  //     user: users[0]
  //   }))
  //   .catch(next)
}

// DELETE /users/:user_id/friends/:id
const declineFriendship = (req, res, next) => {
  const declinerId = req.params.user_id
  const friendId = req.params.id

  Friendship.decline(declinerId, friendId)
    .then(friendships => res.json({
      message: 'Friendship declined.'
    }))
    .catch(next)

  // User.findById(req.params.user_id)
  //   .then(user => {
  //     const friends = user.friends.map(id => String(id))
  //
  //     if (!friends.includes(friendId)) throw createError({
  //       status: UNPROCESSABLE,
  //       message: 'You are currently not friends with this user.'
  //     })
  //
  //     user.friends.remove(friendId)
  //
  //     return user.save()
  //   })
  //   .then(user => res.json({
  //     message: 'Friend removed.',
  //     user
  //   }))
  //   .catch(next)
}

// POST /users/:user_id/friends/:id/ban
const banFriendship = (req, res, next) => {
  const bannerId = req.params.user_id
  const friendId = req.params.id

  Friendship.ban(bannerId, friendId)
    .then(friendships => res.json({
      message: 'Friendship banned.'
    }))
    .catch(next)
}

// DELETE /users/:user_id/friends/:id/ban
// NOTE: Currently this is exactly the same functionality as "decline" above but
// having this separate API endpoint gives us flexibility to potentially do
// something different with "ban" in the future without breaking anything.
const removeBan = (req, res, next) => {
  const bannerId = req.params.user_id
  const friendId = req.params.id

  Friendship.decline(declinerId, friendId)
    .then(friendships => res.json({
      message: 'Friendship declined.'
    }))
    .catch(next)
}

Object.assign(exports, {
  getFriends,
  getFriend,
  getRelationships,
  requestFriendship,
  acceptFriendship,
  declineFriendship,
  banFriendship,
  removeBan
})
