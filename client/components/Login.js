import React, { PropTypes } from 'react';

const Login = React.createClass({
  displayName: 'Login',

  propTypes: {
    onSubmit: PropTypes.func.isRequired
  },

  onSubmit: function (e) {
    e.preventDefault();

    this.props.onSubmit({
      username: this.refs.username.value,
      password: this.refs.password.value
    });
  },

  render: function () {
    return (
      <div className="page">
        <h1>Login</h1>
        <form onSubmit={this.onSubmit} className="login-form">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
                type="text"
                ref="username"
                id="username"
                name="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                ref="password"
                id="password"
                name="password"
            />
          </div>
          <br />
          <button
              type="submit"
              onClick={this.onSubmit}>
            Login
          </button>
        </form>
      </div>
    );
  }
});

export default Login;
