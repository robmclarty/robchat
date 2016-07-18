import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Header = ({
  onClickChat,
  onClickLogout,
  isAuthenticated
}) => {
  const loggedInNav = (
    <nav className="site-nav">
      <button onClick={onClickChat}>Chat</button>
      <button onClick={onClickLogout}>Logout</button>
    </nav>
  );

  const loggedOutNav = (
    <nav className="site-nav">
      <Link to="/rebelchat/register">Sign Up</Link>
      <Link to="/rebelchat/login">Login</Link>
    </nav>
  );

  return (
    <header className="global-header">
      <h1 className="site-name">
        <Link to="/rebelchat/">
          <img src="/images/revolution.png" width="100" height="79" />
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
