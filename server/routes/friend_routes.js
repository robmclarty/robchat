'use strict'

const router = require('express').Router()
const {
  getFriends,
  getFriend,
  requestFriendship,
  acceptFriendship,
  removeFriendship,
  changeFriendship,
  banFriendship,
  removeBan
} = require('../controllers/friend_controller')
const cred = require('../cred')

router.route('/users/:id/friends')
  .all(cred.requireAccessToken)
  .get(getFriends)

// Most-used friendship actions.
router.route('/users/:user_id/friends/:id')
  .all(cred.requireAccessToken)
  .get(getFriend)
  .post(requestFriendship)
  .put(acceptFriendship)
  .delete(removeFriendship)

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
