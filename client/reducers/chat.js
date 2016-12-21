import redveil from 'redveil'
import base64 from 'base64-js'
import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  REFRESH_USERS,
  ADD_USER,
  REMOVE_USER,
  CHANGE_CHANNEL,
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
  LOGOUT_SUCCESS,
  SEND_PUBLIC_KEY,
  RECEIVE_PUBLIC_KEY,
  UPDATE_CHANNEL_KEYS
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
//   userPublicKey: '29b23uib23u823978b2ui2g39u723bu23',
//   sharedSecret: '3iu23uib23iub23iub2kue2bku23beuiu',
//   publicKey: '5b34kjb3498bu34iui83biu43b43uib43',
//   secretKey: '89df9bu34i34b98ueb98234ub34iubuie',
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

// Update the public/secret keys for a single user in a channel's list of users.
// Return a new list of users with the user with userId updated with the keys.
const updateChannelUserKeys = ({
  users = [],
  userId = '',
  publicKey = '',
  secretKey = ''
}) => users.map(user => {
  return user.userId !== userId ? user : {
    ...user,
    publicKey,
    secretKey
  }
})

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
  case UPDATE_CHANNEL_KEYS:
    console.log('action: ', action)
    return {
      ...state,
      channels: {
        ...state.channels,
        [action.channel]: {
          ...state.channels[action.channel],
          users: updateChannelUserKeys({
            users: state.channels[action.channel].users,
            userId: action.userId,
            publicKey: action.publicKey,
            secretKey: action.secretKey
          })
        }
      }
    }
  case RECEIVE_PUBLIC_KEY:
    let index = 0
    let updatedUser = state.channels[action.channel].users.find((user, i) => {
      index = i
      return user.userId === action.senderId
    })

    updatedUser.userPublicKey = action.publicKey

    if (updatedUser.secretKey) {
      const secretKeyBytes = base64.toByteArray(updatedUser.secretKey)
      const publicKeyBytes = base64.toByteArray(updatedUser.userPublicKey)

      updatedUser.sharedKey = base64.fromByteArray(redveil.sharedSecret(secretKeyBytes, publicKeyBytes))
    }

    console.log('received public key, calculating shared key:', {
      userId: action.userId,
      userPublicKey: updatedUser.userPublicKey,
      sharedKey: updatedUser.sharedKey
    })

    return {
      ...state,
      channels: {
        ...state.channels,
        [action.channel]: {
          ...state.channels[action.channel],
          users: state.channels[action.channel].users.map(user => {
            return user.userId !== action.senderId ? user : updatedUser
          })
        }
      }
    }
  case LOGOUT_SUCCESS:
    return initialState
  default:
    return state
  }
}

export default chat
