import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  CognitoState,
//  Logout,
  Login,
  NewPasswordRequired,
  EmailVerification,
  PasswordReset,
  Confirm,
} from 'react-cognito';
import Logout from './Logout';
//import LogoutButton from './LogoutButton';
import LoginForm from './LoginForm';
import EmailVerificationForm from './EmailVerificationForm';
import NewPasswordRequiredForm from './NewPasswordRequiredForm';
import ConfirmForm from './ConfirmForm';
import RegisterForm from './RegisterForm';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateEmailForm from './UpdateEmailForm';
import PasswordResetForm from './PasswordResetForm';


const loggedInPage = (user, attributes) => (
  <div className="authContainer">
    <p>Logged in as {user.getUsername()}</p>
    <p>Profile</p>
    {Object.keys(attributes).map(name => {
      return (
        <label key={name}>
          <span>{name}</span>
          {attributes[name]}
        </label>
        )
      })}
    <ul>
      <li>
        <Logout />
      </li>
      <li><Link to="/#change_password">Change password</Link></li>
      <li><Link to="/#change_email">Change email address</Link></li>
    </ul>
  </div>
);

const loggedOutPage = () => (
  <div className="authContainer">
    <p>Please log in</p>
    <Login>
      <LoginForm />
    </Login>
    <ul>
      <li><Link to="/#register">Register</Link></li>
      <li><Link to="/#reset">Password reset</Link></li>
    </ul>
  </div>
);

const newPasswordPage = () => (
  <div className="authContainer">
    <p>New password required, since this is your first login</p>
    <NewPasswordRequired>
      <NewPasswordRequiredForm />
    </NewPasswordRequired>
    <Link to="/#account">Back to profile</Link>
  </div>
);

const emailVerificationPage = () => (
  <div className="authContainer">
    <p>You must verify your email address.  Please check your email for a code</p>
    <EmailVerification>
      <EmailVerificationForm />
    </EmailVerification>
    <Link to="/#account">Back to profile</Link>
  </div>
);

const confirmForm = () => (
  <div className="authContainer">
    <p>A confirmation code has been sent to your email address</p>
    <Confirm>
      <ConfirmForm />
    </Confirm>
    <Link to="/#account">Back to profile</Link>
  </div>
);

const mfaPage = () => (
  <div>
    <p>You need to enter an MFA, but this library does not yet support them.</p>
  </div>
);

const BaseDashboard = ({ state, user, attributes, pname }) => {
  switch (state) {
    case CognitoState.LOGGED_IN:
      switch (pname) {
        case '#change_email':
          return <UpdateEmailForm />
        case '#change_password':
          return <ChangePasswordForm />  
        default:
          return loggedInPage(user, attributes);
      }
    case CognitoState.AUTHENTICATED:
    case CognitoState.LOGGING_IN:
      return (
        <div className="authContainer">
          <img src="ajax-loader.gif" alt="" />
        </div>
        )
    case CognitoState.LOGGED_OUT:
    case CognitoState.LOGIN_FAILURE:
      switch (pname) {
        case '#register':
          return <RegisterForm />
        case '#reset':
          return <PasswordReset><PasswordResetForm /></PasswordReset>  
        default:
          return loggedOutPage();
      }
      return loggedOutPage();
    case CognitoState.MFA_REQUIRED:
      return mfaPage();
    case CognitoState.NEW_PASSWORD_REQUIRED:
      return newPasswordPage();
    case CognitoState.EMAIL_VERIFICATION_REQUIRED:
      return emailVerificationPage();
    case CognitoState.CONFIRMATION_REQUIRED:
      return confirmForm();
    default:
      return (
        <div className="authContainer">
          <p>Unrecognised cognito state</p>
        </div>
      );
  }
};
BaseDashboard.propTypes = {
  user: PropTypes.object,
  attributes: PropTypes.object,
  state: PropTypes.string,
};

const mapStateToProps = state => ({
  state: state.cognito.state,
  user: state.cognito.user,
  attributes: state.cognito.attributes,
});


const Dashboard = connect(mapStateToProps, null)(BaseDashboard);

export default Dashboard;
