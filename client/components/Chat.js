import React, { PropTypes } from 'react'
import io from 'socket.io-client'

const addUserChatObj = (users, userChatObj) => {
  return users.findIndex(user => user.socketId === userChatObj.socketId) >= 0 ?
    users :
    [...users, userChatObj]
}

const Chat = React.createClass({
  displayName: 'Chat',

  propTypes: {
    isAuthenticated: PropTypes.bool,
    userId: PropTypes.string,
    username: PropTypes.string,
    socket: PropTypes.object
  },

  getDefaultProps: function () {
    return {
      isAuthenticated: false,
      userId: '',
      socketId: '',
      username: '',
      socket: {}
    }
  },

  // Each message is an object with the format:
  // ```
  // {
  //   body: 'String of actual text messsage typed by sender.',
  //   user: {
  //     userId: '12345',
  //     username: 'username-of-sender'
  //   }
  // }
  // ```
  getInitialState: function () {
    return {
      // messages: [],
      // socket: {},
      users: [],
      shouldScrollToBottom: false
    }
  },

  componentDidMount: function () {
    // If there is already an existing token (e.g., because the user navigated
    // away from this page and came back) re-initialize the socket connection.
    if (this.props.socket &&
        this.props.accessToken &&
        this.props.accessToken !== ' ')
      this.initSocketConnection(this.props.accessToken)
  },

  componentWillUnmount: function () {
    if (this.state.socket && typeof this.state.socket.disconnect === 'function')
      this.state.socket.disconnect()
  },

  componentWillReceiveProps: function (nextProps) {
    // Only do this once, when accessToken has been populated.
    if (nextProps.socket &&
        nextProps.accessToken !== this.props.accessToken &&
        this.props.accessToken === '')
      this.initSocketConnection(nextProps.accessToken)
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

  initSocketConnection: function (token) {
    //const socket = io.connect(this.props.host)
    const { socket } = this.props

    console.log('initiating socket connection')

    socket.on('connect', () => {
      socket.emit('authenticate', { token })

      socket.on('authenticated', () => {
        console.log('socket authenticated successfully')

        socket.on('chat:message', msg => this.props.addMessage(msg))

        socket.on('user:join', users => {
          this.setState({ users })
        })

        socket.on('user:leave', users => {
          this.setState({ users })
        })
      })

      socket.on('unauthorized', msg => {
        console.log('socket connection is unauthorized')

        socket.disconnect()
      })
    })
  },

  // onMessage: function (msg) {
  //   this.setState({
  //     messages: [
  //       ...this.state.messages,
  //       msg
  //     ]
  //   })
  // },

  onSubmit: function (e) {
    const msg = this.refs.msg.value

    e.preventDefault()

    // Send message to server.
    this.props.addMessage(msg)
    this.props.socket.emit('chat:message', {
      body: msg,
      user: this.props.user
    })

    // Reset input for accepting new messages.
    this.refs.msg.value = ''
    this.refs.msg.focus()
    this.refs.container.scrollTop = this.refs.container.scrollHeight
  },

  render: function () {
    return (
      <div className="chat" ref="container">
        {/*
        <ul id="users" ref="users" className="chat-users">
            {this.state.users.map((user, index) => (
              <li key={index}>{ user.username }</li>
            ))}
        </ul>
        */}

        <ul id="messages" ref="messages" className="chat-messages">
          {this.props.messages.map((msg, index) => (
            <li key={index}>
              {/*<b>{ msg.user.username }</b>*/}
              &nbsp;
              { msg.body }
            </li>
          ))}
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
