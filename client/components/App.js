import React, { PropTypes } from 'react';
import Header from '../containers/HeaderContainer';
import Flash from '../containers/FlashContainer';

const currentYear = new Date().getFullYear();

const App = ({ isAuthenticated, currentPath, children }) => (
  <div className="app-container rebelchat">
    <Header currentPath={currentPath} />

    <main>
      <Flash />

      {children}
    </main>
  </div>
);

App.propTypes = {
  isAuthenticated: PropTypes.bool,
  children: PropTypes.object
};

export default App;
