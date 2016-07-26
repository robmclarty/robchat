import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  requestFriendship,
  acceptFriendship,
  declineFriendship
} from '../actions'
import FriendsList from '../components/FriendsList'

const mapStateToProps = state => {
  return {
    userId: state.auth.tokenPayload.userId,
    friends: state.relationships.friends || [],
    requests: state.relationships.requests || [],
    pending: state.relationships.pending || [],
    declines: state.relationships.declines || [],
    bans: state.relationships.bans || [],
    rejections: state.relationships.rejections || [],
    isPending: state.relationships.isFetching,
    isAuthenticated: state.auth.isAuthenticated
  }
}

const mapDispatchToProps = dispatch => ({
  onClickFriend: (userId, friendId) => console.log('clicked friend', friendId),
  onRequestFriendship: (friendId, username) => dispatch(requestFriendship(friendId, username)),
  onClickReject: (userId, friendId) => dispatch(declineFriendship(userId, friendId)),
  onClickAccept: (userId, friendId) => dispatch(acceptFriendship(userId, friendId)),
  onClickDecline: (userId, friendId) => dispatch(declineFriendship(userId, friendId)),
  onClickCancelRequest: (userId, friendId) => dispatch(declineFriendship(userId, friendId)),
  onClickRemoveBan: (userId, friendId) => console.log('removing ban ', friendId)
})

const FriendsListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FriendsList)

export default FriendsListContainer
