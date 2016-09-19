import React, { PropTypes } from 'react'

const Profile = React.createClass({
  displayName: 'Profile',

  propTypes: {
    userId: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    isFetching: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    onSubmitProfile: PropTypes.func
  },

  onSubmit: function (e) {
    const profile = {
      id: this.props.userId,
      username: this.refs.username.value,
      email: this.refs.email.value
    }

    e.preventDefault()

    // If password field has been used, add it to the update profile.
    if (this.refs.password.value)
      Object.assign(profile, { password: this.refs.password.value })

    // Execute parent callback.
    this.props.onSubmitProfile(profile)
  },

  render: function () {
    const {
      username,
      email,
      isFetching
    } = this.props

    if (isFetching) return false

    return (
      <div className="profile">
        <h1>{username}</h1>

        <form className="profile-form" onSubmit={this.onSubmit}>
          <input
              ref="username"
              type="text"
              defaultValue={username}
          />
          <br />
          <input
              ref="password"
              type="password"
              placeholder="Leave blank to keep current password."
          />
          <br />
          <input
              ref="email"
              type="text"
              defaultValue={email}
          />
          <br />
          <button
              className="submit-button"
              onClick={this.onSubmit}>
            Save
          </button>
        </form>
      </div>
    )
  }
})

export default Profile
