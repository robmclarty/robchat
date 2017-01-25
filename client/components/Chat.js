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
    channel: PropTypes.string,
    title: PropTypes.string,
    unread: PropTypes.number,
    handleMessage: PropTypes.func
  },

  getDefaultProps: function () {
    return {
      isAuthenticated: false,
      userId: 0,
      username: '',
      messages: [],
      users: [],
      channel: '',
      title: 'robchat',
      unread: 0
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
    this.props.handleMessage({
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

    // If there are more than zero unread messages, and the document is not
    // currently focused, then display the number of unread messages in the
    // document's title.
    // TODO: package this up in its own module.
    if (this.props.unread > 0 && !document.hasFocus()) {
      document.title = `(${ this.props.unread }) ${ this.props.title }`
    } else {
      document.title = this.props.title
    }

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
