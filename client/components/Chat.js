import React, { PropTypes } from 'react'
import io from 'socket.io-client'

const Chat = React.createClass({
  displayName: 'Chat',

  propTypes: {
    isAuthenticated: PropTypes.bool,
    accessToken: PropTypes.string
  },

  getDefaultProps: function () {
    return {
      isAuthenticated: false,
      accessToken: ''
    }
  },

  getInitialState: function () {
    return {
      messages: [],
      socket: {}
    }
  },

  componentDidMount: function () {

  },

  componentWillReceiveProps: function (nextProps) {
    // Only do this once, when accessToken has been populated.
    if (nextProps.accessToken !== this.props.accessToken && this.props.accessToken === '') {
      const socket = io.connect('http://localhost:3000', {
        query:`token=${ nextProps.accessToken }`
      })

      // socket.on('connect', () => {
      //   socket.emit('authenticate', { token: this.props.accessToken })
      // })

      socket.on('chat message', msg => {
        this.onMessage(msg)
      })

      this.setState({ socket })
    }
  },

  onMessage: function (msg) {
    this.setState({ messages: [...this.state.messages, msg] })
  },

  onSubmit: function (e) {
    const msg = this.refs.msg.value

    e.preventDefault()
    this.state.socket.emit('chat message', msg)
    this.refs.msg.value = ''
    this.refs.msg.focus()
    this.refs.container.scrollTop = this.refs.container.scrollHeight
  },

  render: function () {
    return (
      <div className="rebelchat" ref="container">
        <ul id="messages" ref="messages">
          {this.state.messages.map((msg, index) => (
            <li key={index}>{ msg }</li>
          ))}
        </ul>

        <form onSubmit={ this.onSubmit }>
          <input
              id="msg"
              ref="msg"
              autoComplete="off"
          />
          <button
              type="submit">
            Send
          </button>
        </form>
      </div>
    )
  }
})

export default Chat
