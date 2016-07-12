import {
  SHOW_FLASH_MESSAGES,
  HIDE_FLASH_MESSAGES,
  ADD_FLASH_MESSAGE,
  CLEAR_FLASH_MESSAGES,
  CHANGE_FLASH_MESSAGE_STATUS
} from '../constants/ActionTypes';
import { STATUS_PENDING } from '../constants/FlashMessageTypes';

const initialState = {
  isVisible: false,
  status: STATUS_PENDING,
  list: []
};

const flashMessages = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_FLASH_MESSAGES:
      return {
        ...state,
        isVisible: true,
        status: action.status,
        list: [action.messages]
      };
    case HIDE_FLASH_MESSAGES:
      return {
        ...state,
        isVisible: false
      };
    case ADD_FLASH_MESSAGE:
      return {
        ...state,
        list: [...state.flashMessages.list, action.message]
      };
    case CLEAR_FLASH_MESSAGES:
      return {
        ...state,
        messages: []
      };
    case CHANGE_FLASH_MESSAGE_STATUS:
      return {
        ...state,
        status: action.status
      };
    default:
      return state;
  };
};

export default flashMessages;
