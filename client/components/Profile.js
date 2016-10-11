import React, { PropTypes } from 'react'

const Profile = React.createClass({
  displayName: 'Profile',

  propTypes: {
    user: PropTypes.object,
    profile: PropTypes.object,
    isFetching: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    onSubmitUser: PropTypes.func,
    onSubmitProfile: PropTypes.func
  },

  onSubmitUser: function (e) {
    const user = {
      id: this.props.user.id,
      username: this.refs.username.value,
      email: this.refs.email.value
    }

    e.preventDefault()

    // If password field has been used, add it to the update profile.
    if (this.refs.password.value)
      Object.assign(user, { password: this.refs.password.value })

    // Execute parent callback.
    this.props.onSubmitUser(user)
  },

  onSubmitProfile: function (e) {
    const profile = {
      id: this.props.profile.id,
      userId: this.props.userId,
      fullName: this.refs.fullName.value,
      country: this.refs.country.value,
      website: this.refs.website.value,
      twitter: this.refs.twitter.value
    }

    e.preventDefault()

    this.props.onSubmitProfile(profile)
  },

  render: function () {
    const {
      user,
      profile,
      isFetching
    } = this.props

    if (isFetching) return false

    return (
      <div className="page profile">
        <h1>{user.username}</h1>

        <h4>Login Credentials</h4>
        <form className="profile-form" onSubmit={this.onSubmitUser}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
                id="username"
                ref="username"
                type="text"
                defaultValue={user.username}
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
                defaultValue={user.email}
            />
          </div>
          <button
              className="submit-button"
              onClick={this.onSubmitUser}>
            Save
          </button>
        </form>

        <br /><br />

        <h4>Profile</h4>
        <form className="profile-form" onSubmit={this.onSubmitProfile}>
          <div className="field">
            <label htmlFor="fullName">Full Name</label>
            <input
                id="fullName"
                ref="fullName"
                type="text"
                defaultValue={profile.fullName}
            />
          </div>
          <div className="field">
            <label htmlFor="country">Country</label>
            <input
                id="country"
                ref="country"
                type="text"
                defaultValue={profile.country}
            />
          </div>
          <div className="field">
            <label htmlFor="website">Website</label>
            <input
                id="website"
                ref="website"
                type="text"
                defaultValue={profile.website}
            />
          </div>
          <div className="field">
            <label htmlFor="twitter">Twitter</label>
            <input
                id="twitter"
                ref="twitter"
                type="text"
                defaultValue={profile.twitter}
            />
          </div>
          <button
              className="submit-button"
              onClick={this.onSubmitProfile}>
            Save
          </button>
        </form>
      </div>
    )
  }
})

export default Profile
