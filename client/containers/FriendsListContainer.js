import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { requestFriendship } from '../actions'
import FriendsList from '../components/FriendsList'

const mapStateToProps = state => {
  return {
    userId: state.auth.tokenPayload.userId,
    friends: state.relationships.friends || [],
    requests: state.relationships.requests || [],
    pending: state.relationships.pending || [],
    declines: state.relationships.delines || [],
    bans: state.relationships.bans || [],
    rejections: state.relationships.rejections || [],
    isPending: state.relationships.isFetching,
    isAuthenticated: state.auth.isAuthenticated
  }
}

const mapDispatchToProps = dispatch => ({
  onClickFriend: () => console.log('clicked friend'),
  onRequestFriendship: (userId, username) => dispatch(requestFriendship(userId, username)),
  onClickReject: userId => () => console.log('rejecting ', userId),
  onClickAccept: userId => () => console.log('accepting ', userId),
  onClickDecline: userId => () => console.log('declining ', userId),
  onClickCancelRequest: userId => () => console.log('canceling ', userId),
  onClickRemoveBan: userId => () => console.log('removing ban ', userId)
})

const FriendsListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FriendsList)

export default FriendsListContainer
