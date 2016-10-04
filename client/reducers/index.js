import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import flash from './flash'
import profile from './profile'
import relationships from './relationship'
import messages from './messages'

const rootReducer = combineReducers({
  auth,
  flash,
  profile,
  relationships,
  messages,
  routing: routerReducer
})

export default rootReducer
