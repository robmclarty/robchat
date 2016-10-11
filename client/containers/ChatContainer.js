import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import io from 'socket.io-client'
import Chat from '../components/Chat'
import config from '../../config/client'
import { sendMessage } from '../actions'

const mapStateToProps = state => {
  const channel = state.chat.activeChannel
  const channelLoaded = Boolean(state.chat.channels[channel])

  return {
    users: channelLoaded ? state.chat.channels[channel].users : [],
    messages: channelLoaded ? state.chat.channels[channel].messages : [],
    isAuthenticated: state.auth.isAuthenticated,
    userId: Number(state.auth.userId),
    username: state.auth.username,
    channel
  }
}

const mapDispatchToProps = dispatch => ({
  sendMessage: msg => dispatch(sendMessage(msg.channel, msg))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat)
