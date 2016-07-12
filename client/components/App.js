import React, { PropTypes } from 'react'
import io from 'socket.io-client'

const socket = io()

const App = React.createClass({
  displayName: 'App',

  getInitialState: function () {
    return {
      messages: []
    }
  },

  componentDidMount: function () {
    socket.on('chat message', msg => {
      this.onMessage(msg)
    })
  },

  onMessage: function (msg) {
    this.setState({ messages: [...this.state.messages, msg] })
  },

  onSubmit: function (e) {
    const msg = this.refs.msg.value

    e.preventDefault()
    socket.emit('chat message', msg)
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

export default App
