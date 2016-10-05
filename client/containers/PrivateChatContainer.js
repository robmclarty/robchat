import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import io from 'socket.io-client'
import Chat from '../components/Chat'
import config from '../../config/client'
import { sendMessage } from '../actions'

const mapStateToProps = state => ({
  users: state.chat.users,
  messages: state.chat.messages,
  isAuthenticated: state.auth.isAuthenticated,
  userId: state.auth.userId,
  username: state.auth.username
})

const mapDispatchToProps = dispatch => ({
  sendMessage: msg => dispatch(sendMessage(msg))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat)
