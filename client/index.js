import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, Redirect, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerMiddleware, push } from 'react-router-redux'
import jwtApi from './middleware/jwt-api'
import appReducer from './reducers'
import { autoLogin } from './actions'

// Containers
import requireAuth from './containers/AuthenticatedComponent'
import App from './containers/AppContainer'
import Login from './containers/LoginContainer'
import Register from './containers/RegisterContainer'
import Chat from './containers/ChatContainer'
import FriendsList from './containers/FriendsListContainer'
// import Profile from './containers/ProfileContainer'
import NotFound from './components/NotFound'

// Detect and use chrome redux extension if available.
const devTools = window.devToolsExtension ?
  window.devToolsExtension() :
  f => f

// Setup custom middleware (esp. JWT API calls, and react-router redux store).
const middlewares = compose(
  applyMiddleware(
    jwtApi,
    routerMiddleware(browserHistory)
  ),
  devTools
)

// Create store from app's reducers combined with react-router's routerReducer.
const store = createStore(appReducer, middlewares)

// Hook up react-router history to redux store.
const history = syncHistoryWithStore(browserHistory, store)

// Try to login from tokens in localstorage.
store.dispatch(autoLogin())

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/rebelchat" component={App}>
        <IndexRoute component={Login} />
        <Route path="/rebelchat/login" component={Login} />
        <Route path="/rebelchat/register" component={Register} />
        <Route path="/rebelchat/chat" component={Chat} />
        <Route path="/rebelchat/friends" component={FriendsList} />
        {/*
        <Route path="/rebelchat/profile" component={Profile} />
        */}
        <Route path="/rebelchat/*" component={NotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('rebelchat-app')
)
