import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Chat from '../components/Chat';

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  accessToken: state.auth.tokens.accessToken
});

const mapDispatchToProps = dispatch => ({
});

const ChatContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);

export default ChatContainer;
