import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import flash from './flash'
import profile from './profile'
import relationships from './relationship'
import chat from './chat'

const rootReducer = combineReducers({
  auth,
  flash,
  profile,
  relationships,
  chat,
  routing: routerReducer
})

export default rootReducer
