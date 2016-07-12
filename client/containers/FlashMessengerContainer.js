import React from 'react';
import { connect } from 'react-redux';
import FlashMessenger from '../components/FlashMessenger';

const mapStateToProps = (state, ownProps) => ({
  status: state.flashMessages.status,
  messages: state.flashMessages.list,
  isVisible: (state.flashMessages.isVisible// ||
    // state.users.isFetching ||
    // state.messages.isFetching
  )
  // isFetchingMessages: state.messages.isFetching,
  // isFetchingUsers: state.users.isFetching
});

const mapDispatchToProps = dispatch => ({
  onClickClose: () => console.log('clicked close')
});

const FlashMessengerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashMessenger);

export default FlashMessengerContainer;
