import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import flashMessages from './flashMessages'
import profile from './profile'
import relationships from './relationship'

const rootReducer = combineReducers({
  auth,
  flashMessages,
  profile,
  relationships,
  routing: routerReducer
})

export default rootReducer
