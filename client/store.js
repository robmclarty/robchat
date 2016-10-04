import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'
import authMiddleware from './middleware/auth_middleware'
import socketMiddleware from './middleware/socket_middleware'
import appReducer from './reducers'

export const configureStore = () => {
  // Detect and use chrome redux extension if available.
  const devTools = window.devToolsExtension ?
    window.devToolsExtension() :
    f => f

  // Setup custom middleware (esp. JWT API calls, and react-router redux store).
  const middlewares = compose(
    applyMiddleware(
      authMiddleware,
      socketMiddleware,
      routerMiddleware(browserHistory)
    ),
    devTools
  )

  return createStore(appReducer, middlewares)
}
