import React, { PropTypes } from 'react';
import Header from '../containers/HeaderContainer';
import FlashMessenger from '../containers/FlashMessengerContainer';

const currentYear = new Date().getFullYear();

const App = ({ isAuthenticated, currentPath, children }) => (
  <div className="app-container rebelchat">
    <Header currentPath={currentPath} />

    <main>
      <FlashMessenger />

      {children}
    </main>

    <footer>&copy; {currentYear} Rob McLarty</footer>
  </div>
);

App.propTypes = {
  isAuthenticated: PropTypes.bool,
  children: PropTypes.object
};

export default App;
