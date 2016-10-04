import {
  ADD_MESSAGE
} from '../constants/ActionTypes'

export const addMessage = msg => ({
  type: ADD_MESSAGE,
  message: msg
})
