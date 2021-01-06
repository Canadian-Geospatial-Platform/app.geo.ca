import React from 'react';
import PropTypes from 'prop-types';

class ConfirmForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      verificationCode: '',
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.verificationCode)
     .then((user) => {
       console.log(user);
     })
     .catch((error) => {
       this.setState({ error });
     });
  }

  onResend = (event) => {
    event.preventDefault();
    this.props.onResend()
     .then((user) => {
       this.setState({ error: 'Code resent' });
     })
     .catch((error) => {
       this.setState({ error });
     });

  }

  changeVerificationCode = (event) => {
    this.setState({ verificationCode: event.target.value });
  }

  render = () => (
    <div className="authForm">
      <div className="errMessage">{this.state.error}</div>
      <label>
        <span>Verification Code</span>
        <input placeholder="code" onChange={this.changeVerificationCode} required />
      </label>
      <button className="btn-button" type="button" onClick={this.onSubmit}>Submit</button>
      <button className="btn-button" type="button" onClick={this.onResend}>Resend code</button>
      <button className="btn-button" type="button" onClick={this.props.onCancel}>Cancel</button>

    </div>
  )
}
ConfirmForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onResend: PropTypes.func,
  error: PropTypes.string,
};

export default ConfirmForm;
