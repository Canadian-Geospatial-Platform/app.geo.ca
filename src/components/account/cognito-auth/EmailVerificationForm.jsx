import React from 'react';
import PropTypes from 'prop-types';

class EmailVerificationForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: props.error,
      verificationCode: '',
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.verificationCode);
  }

  changeVerificationCode = (event) => {
    this.setState({ verificationCode: event.target.value });
  }

  render = () => (
    <div className="authForm">
      <div className="errMessage">{this.props.error}</div>
      <label>
        <span>Verification Code</span>
        <input placeholder="code" onChange={this.changeVerificationCode} required />
      </label>
      <button className="btn-button" type="button" onClick={this.onSubmit}>Submit</button>
      <button className="btn-button" type="button" onClick={this.props.onCancel}>Cancel</button>
    </div>
  )
}
EmailVerificationForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  error: PropTypes.string,
};

export default EmailVerificationForm;
