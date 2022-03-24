import React from 'react';
import PropTypes from 'prop-types';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      username: props.username,
      password: '',
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.username, this.state.password);
  }

  changeUsername = (event) => {
    this.setState({ username: event.target.value });
  }

  changePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  componentWillUnmount = () => {
    this.props.clearCache();
  }

  render = () => (
    <div className="authForm">
      <div className="errMessage">{this.props.error}</div>
      <div>{this.state.email}</div>
      <label>
        <span>Username</span>
        <input placeholder="Username" value={this.state.username} onChange={this.changeUsername} required />
      </label>
      <label>
        <span>Password</span>
        <input placeholder="Password" onChange={this.changePassword} type="password" required />
      </label>
      <button className="btn-button" type="button" onClick={this.onSubmit}>Sign in</button>
    </div>
  )
}
LoginForm.propTypes = {
  onSubmit: PropTypes.func,
  clearCache: PropTypes.func,
  username: PropTypes.string,
  error: PropTypes.string,
  email: PropTypes.string,
};

export default LoginForm;
