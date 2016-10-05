import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  REFRESH_USERS,
  ADD_USER,
  REMOVE_USER,
  CHANGE_CHANNEL,
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
  LOGOUT_SUCCESS
} from '../constants/ActionTypes'

// channels: {
//   'lobby': {
//     messages: [],
//     users: []
//   },
//   'some-other-channel': {
//     messages: [],
//     users: []
//   }
// }
const addChannel = (channels, name) => ({
  ...channels,
  [name]: {
    messages: [],
    users: []
  }
})

// Filter out `name` from the list of channel names in `channels` and then
// return a new array which includes all channels with the remaining names.
// This is immutable, compared to simply using `delete channels[name]`.
const removeChannel = (channels, name) => {
  return Object.keys(channels)
    .filter(channelName => channelName !== name)
    .reduce((result, channelName) => {
      result[channelName] = channels[channelName]
      return result
    }, {})
}

// user: {
//   socketId: '/#WkOlE5hSgY4sMDX8AAAA',
//   userId: '57e042f35c1d764fdc28780f',
//   username: 'rob'
// }
const createUser = ({ socketId, userId, username }) => ({
  socketId,
  userId,
  username
})

// message: {
//   body: 'This is my message',
//   userId: '57f530e3ca38c0d7484e1de7',
//   username: 'rob'
//   createdAt: '1475695930'
// }
const createMessage = ({ body, userId, username, createdAt }) => ({
  body,
  userId,
  username,
  createdAt
})

const addUser = (list, user) => {
  return [...list, user]
}

const removeUser = (list, user) => {
  return list.filter(user => user.userId !== user.userId)
}

const initialState = {
  channels: {},
  activeChannel: '',
  error: ''
}

const chat = (state = initialState, action) => {
  switch (action.type) {
  case SEND_MESSAGE:
  case RECEIVE_MESSAGE:
    return {
      ...state,
      channels: {
        ...state.channels,
        [action.channel]: {
          messages: [
            ...state.channels[action.channel].messages,
            createMessage(action.message)
          ],
          users: state.channels[action.channel].users
        }
      }
    }
  // case LOAD_MESSAGES:
  //   return {
  //     ...state,
  //     messages: action.messages,
  //     isFetching: false,
  //     isLoaded: true,
  //     fetchHistory: [
  //       ...state.fetchHistory,
  //       {
  //         date: action.date,
  //         channel: action.channel
  //       }
  //     ]
  //   }
  // case LOAD_MESSAGES_PENDING:
  //   return {
  //     ...state,
  //     isFetching: true
  //   }
  // case LOAD_MESSAGES_FAIL:
  //   return {
  //     ...state,
  //     isFetching: false,
  //     isLoaded: false,
  //     error: action.error
  //   }
  case REFRESH_USERS:
    return {
      ...state,
      channels: {
        ...state.channels,
        [action.channel]: {
          messages: state.channels[action.channel].messages,
          users: action.users
        }
      }
    }
  case ADD_USER:
    return {
      ...state,
      channels: {
        ...state.channels,
        [action.channel]: {
          messages: state.channels[action.channel].messages,
          users: [
            ...state.channels[action.channel].users,
            createUser(action.user)
          ]
        }
      }
    }
  case REMOVE_USER:
    return {
      ...state,
      channels: {
        ...state.channels,
        [action.channel]: {
          messages: state.channels[action.channel].messages,
          users: state.channels[actions.channel].users.filter(user => {
            return user.userId !== action.userId
          })
        }
      }
    }
  case CHANGE_CHANNEL:
    return {
      ...state,
      activeChannel: action.channel
    }
  case JOIN_CHANNEL:
    return {
      ...state,
      channels: addChannel(state.channels, action.channel)
    }
  case LEAVE_CHANNEL:
    return {
      ...state,
      channels: removeChannel(state.channels, action.channel)
    }
  case LOGOUT_SUCCESS:
    return initialState
  default:
    return state
  }
}

export default chat
