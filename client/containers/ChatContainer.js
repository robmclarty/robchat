import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import io from 'socket.io-client'
import Chat from '../components/Chat'
import config from '../../config/client'
import { addMessage } from '../actions'

const ChatContainer = React.createClass({
  displayName: 'ChatContainer',

  propTypes: {
  },

  getInitialState: function () {
    return {
      socket: undefined
    }
  },

  componentWillMount: function () {
    this.setState({
      socket: io.connect(config.socketUrl, { path: '/chat' })
    })
    //fetchMessages(initialChannel)
    //fetchChannels(username)
  },

  render: function () {
    return (
      <Chat {...this.props} socket={this.state.socket} />
    )
  }
})

const mapStateToProps = state => ({
  // socket: state.auth.isAuthenticated ?
  //   io.connect(config.socketUrl, { path: '/chat' }) :
  //   undefined,
  //host: config.socketUrl,
  messages: state.messages.list,
  isAuthenticated: state.auth.isAuthenticated,
  accessToken: state.auth.tokens.accessToken,
  //user: createChatUser(state.auth.tokenPayload)
  userId: state.auth.userId,
  socketId: state.auth.socketId,
  username: state.auth.username
})

const mapDispatchToProps = dispatch => ({
  //createMessage: msg => dispatch(createMessage(msg)),
  addMessage: msg => dispatch(addMessage(msg))
  //fetchMessages: channel => dispatch(actions.fetchMessages(channel)),
  //fetchChannels: username => dispatch(actions.fetchChannels(username))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContainer)
