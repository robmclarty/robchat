import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import friends from './friends'
import profile from './profile'
import flashMessages from './flashMessages'

const rootReducer = combineReducers({
  auth,
  friends,
  profile,
  flashMessages,
  routing: routerReducer
})

export default rootReducer
