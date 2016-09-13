import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Chat from '../components/Chat'

// TODO: Change this so it is constructed on the server where a message emitted
// by the client only includes the user's id, and then a chatUser object is
// securely created and included in the message on the server so that it can be
// guaranteed that no user data is leaked as a result of XSS or other
// client-side vulnerabilities.
const createChatUser = tokenPayload => ({
  userId: tokenPayload.userId,
  username: tokenPayload.username
})

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  accessToken: state.auth.tokens.accessToken,
  user: createChatUser(state.auth.tokenPayload)
})

const mapDispatchToProps = dispatch => ({
})

const ChatContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat)

export default ChatContainer
