'use strict'

const router = require('express').Router()
// const {
//   getFriends,
//   getFriend,
//   getRelationships,
//   requestFriendship,
//   acceptFriendship,
//   declineFriendship,
//   changeFriendship,
//   banFriendship,
//   removeBan
// } = require('../controllers/friend_controller')
const {
  requireReadFriends,
  requireWriteFriends
} = require('../middleware/auth_middleware')

// router.route('/users/:id/relationships')
//   .get(requireReadFriends, getRelationships)
//
// router.route('/users/:id/friends')
//   .get(requireReadFriends, getFriends)
//   .post(requireWriteFriends, requestFriendship)
//
// // Most-used friendship actions.
// router.route('/users/:user_id/friends/:id')
//   .get(requireReadFriends, getFriend)
//   .put(requireWriteFriends, acceptFriendship)
//   .delete(requireWriteFriends, declineFriendship)
//
// // Special friendship action to ban all future friendships.
// router.route('/users/:user_id/friends/:id/ban')
//   .post(requireWriteFriends, banFriendship)
//   .delete(requireWriteFriends, removeBan)


// router.route('/users/:user_id/favorites/:id')
//   .all(cred.requireAccessToken)
//   .get(getFavorite)
//   .post(makeFavorite)
//   .delete(removeFavorite)

module.exports = router
