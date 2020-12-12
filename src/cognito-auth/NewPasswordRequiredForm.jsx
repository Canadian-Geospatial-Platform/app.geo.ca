import React from 'react';
import PropTypes from 'prop-types';

class NewPasswordRequiredForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: props.error,
      password: '',
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.password);
  }

  changePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  render = () => (
    <div className="authForm">
      <div className="errMessage">{this.props.error}</div>
      <label>
        <span>Password</span>
        <input placeholder="new password" onChange={this.changePassword} required />
      </label>
      <button type="button" onClick={this.onSubmit}>Set new password</button>
    </div>
  )
}
NewPasswordRequiredForm.propTypes = {
  onSubmit: PropTypes.func,
  error: PropTypes.string,
};

export default NewPasswordRequiredForm;
