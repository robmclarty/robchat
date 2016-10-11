import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { updateProfile, updateUser } from '../actions'
import Profile from '../components/Profile'

const mapStateToProps = state => ({
  user: state.user,
  profile: state.profile,
  isAuthenticated: state.auth.isAuthenticated,
  isFetching: state.profile.isFetching || state.user.isFetching
})

const mapDispatchToProps = dispatch => ({
  onSubmitUser: user => dispatch(updateUser(user)),
  onSubmitProfile: profile => dispatch(updateProfile(profile))
})

const ProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)

export default ProfileContainer
