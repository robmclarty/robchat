'use strict'

const router = require('express').Router()
const {
  getFriends,
  getFriend,
  getRelationships,
  requestFriendship,
  acceptFriendship,
  declineFriendship,
  changeFriendship,
  banFriendship,
  removeBan
} = require('../controllers/friend_controller')
const cred = require('../cred')

router.route('/users/:id/relationships')
  .all(cred.requireAccessToken)
  .get(getRelationships)

router.route('/users/:id/friends')
  .all(cred.requireAccessToken)
  .get(getFriends)
  .post(requestFriendship)

// Most-used friendship actions.
router.route('/users/:user_id/friends/:id')
  .all(cred.requireAccessToken)
  .get(getFriend)
  .put(acceptFriendship)
  .delete(declineFriendship)

// Special friendship action to ban all future friendships.
router.route('/users/:user_id/friends/:id/ban')
  .all(cred.requireAccessToken)
  .post(banFriendship)
  .delete(removeBan)

//
// router.route('/users/:user_id/favorites/:id')
//   .all(cred.requireAccessToken)
//   .get(getFavorite)
//   .post(makeFavorite)
//   .delete(removeFavorite)

module.exports = router
