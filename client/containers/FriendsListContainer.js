import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { requestFriendship } from '../actions'
import FriendsList from '../components/FriendsList'

const mapStateToProps = state => ({
  userId: state.auth.tokenPayload.userId,
  friends: state.friends.list,
  isPending: state.friends.isFetching,
  isAuthenticated: state.auth.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
  onClickFriend: () => console.log('clicked friend'),
  onRequestFriendship: (userId, username) => dispatch(requestFriendship(userId, username))
})

const FriendsListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FriendsList)

export default FriendsListContainer
