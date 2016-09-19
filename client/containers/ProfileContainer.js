import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { updateUser } from '../actions'
import Profile from '../components/Profile'

const mapStateToProps = state => ({
  userId: state.profile.id,
  username: state.profile.username,
  email: state.profile.email,
  isAuthenticated: state.auth.isAuthenticated,
  isFetching: state.profile.isFetching
})

const mapDispatchToProps = dispatch => ({
  onSubmitProfile: profile => dispatch(updateUser(profile))
})

const ProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)

export default ProfileContainer
