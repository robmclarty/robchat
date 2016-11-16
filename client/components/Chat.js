import React, { PropTypes } from 'react'
import moment from 'moment'

const Chat = React.createClass({
  displayName: 'Chat',

  propTypes: {
    isAuthenticated: PropTypes.bool,
    userId: PropTypes.number,
    username: PropTypes.string,
    messages: PropTypes.array,
    users: PropTypes.array,
    channel: PropTypes.string
  },

  getDefaultProps: function () {
    return {
      isAuthenticated: false,
      userId: 0,
      username: '',
      messages: [],
      users: [],
      channel: ''
    }
  },

  getInitialState: function () {
    return {
      shouldScrollToBottom: false
    }
  },

  componentWillUpdate: function () {
    const messagePanel = this.refs.messages
    this.shouldScrollToBottom = messagePanel.scrollTop + messagePanel.offsetHeight === messagePanel.scrollHeight
  },

  componentDidUpdate: function () {
    if (this.shouldScrollToBottom) {
      const messagePanel = this.refs.messages
      messagePanel.scrollTop = messagePanel.scrollHeight
    }
  },

  onSubmit: function (e) {
    const msg = this.refs.msg.value

    e.preventDefault()

    // Send message to server.
    this.props.sendMessage({
      body: msg,
      channel: this.props.channel,
      userId: this.props.userId,
      username: this.props.username,
      createdAt: Date.now()
    })

    // Reset input for accepting new messages.
    this.refs.msg.value = ''
    this.refs.msg.focus()
    this.refs.container.scrollTop = this.refs.container.scrollHeight
  },

  render: function () {
    let prevUsername = ''

    return (
      <div className="chat" ref="container">
        <ul id="users" ref="users" className="chat-users">
            {this.props.users.map((user, index) => (
              <li key={index}>{ user.username }</li>
            ))}
        </ul>

        <ul id="messages" ref="messages" className="chat-messages">
          {this.props.messages.map((msg, index) => {
            const isSameUser = prevUsername === msg.username

            prevUsername = msg.username

            return (
              <li key={index}>
                {!isSameUser &&
                  <div className="message-meta">
                    <b>{ msg.username }</b>
                    <span>{ moment(msg.createdAt).calendar() }</span>
                  </div>
                }
                <div className="message-body">{ msg.body }</div>
              </li>
            )
          })}
        </ul>

        <form onSubmit={ this.onSubmit } className="chat-form">
          <input
              className="chat-input"
              type="text"
              id="msg"
              ref="msg"
              placeholder="Type a message here"
              autoComplete="off"
          />
        </form>
      </div>
    )
  }
})

export default Chat
