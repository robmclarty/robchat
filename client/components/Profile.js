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
      <div className="page profile">
        <h1>{username}</h1>

        <form className="profile-form" onSubmit={this.onSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
                id="username"
                ref="username"
                type="text"
                defaultValue={username}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
                id="password"
                ref="password"
                type="password"
                placeholder="Leave blank to keep current password."
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
                id="email"
                ref="email"
                type="text"
                defaultValue={email}
            />
          </div>
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
