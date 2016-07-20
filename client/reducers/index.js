import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import friends from './friends'
import flashMessages from './flashMessages'

const rootReducer = combineReducers({
  auth,
  friends,
  flashMessages,
  routing: routerReducer
})

export default rootReducer
