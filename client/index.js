import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Redirect, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, push } from 'react-router-redux'
import { autoLogin, resetFlash } from './actions'
import { configureStore } from './store'

// Containers
import requireAuth from './containers/AuthenticatedComponent'
import App from './containers/AppContainer'
import Login from './containers/LoginContainer'
import Register from './containers/RegisterContainer'
import Chat from './containers/ChatContainer'
import FriendControls from './containers/FriendControlsContainer'
import Profile from './containers/ProfileContainer'
import NotFound from './components/NotFound'

// Create store from app's reducers combined with react-router's routerReducer.
const store = configureStore()

// Hook up react-router history to redux store.
const history = syncHistoryWithStore(browserHistory, store)

// Try to login from tokens in localstorage.
store.dispatch(autoLogin())

const resetFlashOnEnter = () => store.dispatch(resetFlash())

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/rebelchat" component={App}>
        <IndexRoute component={Login} />
        <Route path="/rebelchat/login" component={Login} onEnter={resetFlashOnEnter} />
        <Route path="/rebelchat/profile" component={Profile} onEnter={resetFlashOnEnter} />
        <Route path="/rebelchat/register" component={Register} onEnter={resetFlashOnEnter} />
        <Route path="/rebelchat/chat" component={Chat} onEnter={resetFlashOnEnter} />
        <Route path="/rebelchat/friends" component={FriendControls} onEnter={resetFlashOnEnter} />
        <Route path="/rebelchat/*" component={NotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('rebelchat-app')
)
