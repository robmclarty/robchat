import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  REFRESH_USER_LIST,
  REMOVE_USER,
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
  LOAD_MESSAGES,
  LOAD_MESSAGES_PENDING,
  LOAD_MESSAGES_FAIL,
  LOGOUT_SUCCESS
} from '../constants/ActionTypes'

const initialState = {
  messages: [],
  users: [],
  channels: [],
  isFetching: false,
  isLoaded: false,
  fetchHistory: [],
  error: ''
}

const chat = (state = initialState, action) => {
  switch (action.type) {
  case SEND_MESSAGE:
  case RECEIVE_MESSAGE:
    return {
      ...state,
      messages: [...state.messages, action.message]
    }
  case LOAD_MESSAGES:
    return {
      ...state,
      messages: action.messages,
      isFetching: false,
      isLoaded: true,
      fetchHistory: [
        ...state.fetchHistory,
        {
          date: action.date,
          channel: action.channel
        }
      ]
    }
  case LOAD_MESSAGES_PENDING:
    return {
      ...state,
      isFetching: true
    }
  case LOAD_MESSAGES_FAIL:
    return {
      ...state,
      isFetching: false,
      isLoaded: false,
      error: action.error
    }
  case REFRESH_USER_LIST:
    return {
      ...state,
      users: action.users
    }
  case REMOVE_USER:
    return {
      ...state,
      users: state.users.filter(user => user.socketId === action.socketId)
    }
  case JOIN_CHANNEL:
    return {
      ...state,
      channels: [...state.channels, action.channel]
    }
  case LEAVE_CHANNEL:
    return {
      ...state,
      channels: state.channels.filter(channel => action.channel)
    }
  case LOGOUT_SUCCESS:
    return initialState
  default:
    return state
  }
}

export default chat
