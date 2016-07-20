import React, { PropTypes } from 'react'

const AddFriend = React.createClass({
  displayName: 'AddFriend',

  propTypes: {
    onRequestFriendship: PropTypes.func
  },

  onSubmit: function (e) {
    const username = this.refs.q.value

    e.preventDefault()

    this.props.onRequestFriendship(username)
    this.refs.q.value = ''
  },

  render: function () {
    return (
      <form
          className="request-friend-form"
          action="">
        <input
            type="text"
            ref="q"
            className="request-friend-input"
        />
        <button
            type="submit"
            onClick={this.onSubmit}>
          Request Friendship
        </button>
      </form>
    )
  }
})

export default AddFriend
