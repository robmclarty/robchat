import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Header = ({
  username,
  onClickUsername,
  onClickChat,
  onClickFriends,
  onClickLogin,
  onClickLogout,
  onClickSignup,
  isAuthenticated
}) => {
  const loggedInNav = (
    <nav className="site-nav">
      <button onClick={onClickUsername}>{username}</button>
      <button onClick={onClickChat}>Chat</button>
      <button onClick={onClickFriends}>Friends</button>
      <button onClick={onClickLogout}>Logout</button>
    </nav>
  );

  const loggedOutNav = (
    <nav className="site-nav">
      <button onClick={onClickSignup}>Sign Up</button>
      <button onClick={onClickLogin}>Login</button>
    </nav>
  );

  return (
    <header className="global-header">
      <h1 className="site-name">
        <Link to="/rebelchat/">
          <img src="/favicon-32x32.png" width="32" height="32" />
          <span><b>Rebel Chat</b></span>
        </Link>
      </h1>

      {isAuthenticated ? loggedInNav : loggedOutNav}
    </header>
  );
};

Header.propTypes = {
  onClickLogout: PropTypes.func,
  isAuthenticated: PropTypes.bool
};

export default Header;
