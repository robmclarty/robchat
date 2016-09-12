import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  requestFriendship,
  acceptFriendship,
  declineFriendship,
  createPrivateChat
} from '../actions'
import FriendControls from '../components/FriendControls'

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
  onRequestFriendship: (friendId, username) => dispatch(requestFriendship(friendId, username)),
  onClickChat: (userId, friendId) => dispatch(createPrivateChat(userId, friendId)),
  onClickFriend: (userId, friendId) => console.log('clicked friend', friendId),
  onClickReject: (userId, friendId) => dispatch(declineFriendship(userId, friendId)),
  onClickAccept: (userId, friendId) => dispatch(acceptFriendship(userId, friendId)),
  onClickDecline: (userId, friendId) => dispatch(declineFriendship(userId, friendId)),
  onClickCancelRequest: (userId, friendId) => dispatch(declineFriendship(userId, friendId)),
  onClickRemoveBan: (userId, friendId) => console.log('removing ban ', friendId)
})

const FriendControlsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FriendControls)

export default FriendControlsContainer
