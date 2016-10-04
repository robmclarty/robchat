import {
  ADD_MESSAGE,
  LOAD_MESSAGES,
  LOAD_MESSAGES_PENDING,
  LOAD_MESSAGES_FAIL,
  LOGOUT_SUCCESS
} from '../constants/ActionTypes'

const initialState = {
  list: [],
  isFetching: false,
  isLoaded: false,
  fetchHistory: [],
  error: ''
}

const messages = (state = initialState, action) => {
  switch (action.type) {
  case ADD_MESSAGE:
    return {
      ...state,
      list: [...state.list, action.message]
    }
  case LOAD_MESSAGES:
    return {
      ...state,
      list: action.messages,
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
  case LOGOUT_SUCCESS:
    return initialState
  default:
    return state
  }
}

export default messages
