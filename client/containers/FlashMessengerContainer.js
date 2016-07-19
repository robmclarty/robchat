import React from 'react'
import { connect } from 'react-redux'
import { hideFlashMessages } from '../actions'
import FlashMessenger from '../components/FlashMessenger'

const mapStateToProps = (state, ownProps) => ({
  status: state.flashMessages.status,
  messages: state.flashMessages.list,
  isVisible: state.flashMessages.isVisible
})

const mapDispatchToProps = dispatch => ({
  onClickClose: () => dispatch(hideFlashMessages())
})

const FlashMessengerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashMessenger)

export default FlashMessengerContainer
