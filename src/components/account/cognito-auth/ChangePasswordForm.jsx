import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { changePassword } from 'react-cognito';

class ChangePasswordForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      oldPassword: '',
      newPassword: '',
    };
  }

  onSubmit = (event) => {
    //const { store } = this.context;
    //const state = store.getState();
    const user = this.props.user;
    event.preventDefault();
    changePassword(user, this.state.oldPassword, this.state.newPassword).then(
      () => this.setState({ error: 'Password changed' }),
      error => this.setState({ error }));
  }

  changeOldPassword = (event) => {
    this.setState({ oldPassword: event.target.value });
  }

  changeNewPassword = (event) => {
    this.setState({ newPassword: event.target.value });
  }

  render = () => (
      <div className="authForm">
        <div className="errMessage">{this.state.error}</div>
        <label>
          Old Password
          <input placeholder="old password" onChange={this.changeOldPassword} required />
        </label>
        <label>
          New Password
          <input placeholder="new password" onChange={this.changeNewPassword} required />
        </label>
        <button className="btn-button" type="button" onClick={this.onSubmit}>Set new password</button>
      </div>
  )
}
// ChangePasswordForm.contextTypes = {
//   store: PropTypes.object,
// };

ChangePasswordForm.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.cognito.user,
});

export default connect(mapStateToProps, null)(ChangePasswordForm);
