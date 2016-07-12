import {
  SHOW_FLASH_MESSAGES,
  HIDE_FLASH_MESSAGES,
  ADD_FLASH_MESSAGE,
  CLEAR_FLASH_MESSAGES,
  CHANGE_FLASH_MESSAGE_STATUS
} from '../constants/ActionTypes';
import {
  STATUS_PENDING,
  STATUS_ERROR,
  STATUS_SUCCESS,
  STATUS_INFO,
  STATUS_WARNING
} from '../constants/FlashMessageTypes';

export const showFlashMessages = ({ status, messages }) => ({
  type: SHOW_FLASH_MESSAGES,
  status,
  messages
});

export const hideFlashMessages = () => ({
  type: HIDE_FLASH_MESSAGES
});
