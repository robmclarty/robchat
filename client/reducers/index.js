import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import flashMessages from './flashMessages';

const rootReducer = combineReducers({
  auth,
  flashMessages,
  routing: routerReducer
});

export default rootReducer;
