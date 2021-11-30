import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import UpdateProfileForm from './UpdateProfileForm';
import PasswordResetForm from './PasswordResetForm';

import './auth.scss';

const BaseDashboard = ({ state, user, attributes}) => {
  const [pname, setPage] = useState(""); 

  const loggedInPage = (user, attributes) => (
    <div className="authContainer">
      <p>Logged in as {user.getUsername()}</p>
      <p>Profile</p>
      {Object.keys(attributes).map(name => {
        return (
          <label key={name}>
            <span>{name}: </span>
            {attributes[name]}
          </label>
          )
        })}
      <ul>
        <li>
          <Logout />
        </li>
        <li><button className="link-button" onClick={()=>setPage("change_password")}>Change password</button></li>
        <li><button className="link-button" onClick={()=>setPage("change_email")}>Change email address</button></li>
        <li><button className="link-button" onClick={()=>setPage("change_profile")}>Change profile</button></li>
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
        <li><button className="link-button" onClick={()=>setPage("register")}>Register</button></li>
        <li><button className="link-button" onClick={()=>setPage("reset")}>Password reset</button></li>
      </ul>
    </div>
  );
  
  const newPasswordPage = () => (
    <div className="authContainer">
      <p>New password required, since this is your first login</p>
      <NewPasswordRequired>
        <NewPasswordRequiredForm />
      </NewPasswordRequired>
      <button className="link-button" onClick={()=>setPage("account")}>Back to profile</button>
    </div>
  );
  
  const emailVerificationPage = () => (
    <div className="authContainer">
      <p>You must verify your email address.  Please check your email for a code</p>
      <EmailVerification>
        <EmailVerificationForm />
      </EmailVerification>
      <button className="link-button" onClick={()=>setPage("account")}>Back to profile</button>
    </div>
  );
  
  const confirmForm = () => (
    <div className="authContainer">
      <p>A confirmation code has been sent to your email address</p>
      <Confirm>
        <ConfirmForm />
      </Confirm>
      <button className="link-button" onClick={()=>setPage("account")}>Back to profile</button>
    </div>
  );

  const registerPage = () => (
    <div className="authContainer">
      <p>Register a new account</p>
      <RegisterForm />
      <button className="link-button" onClick={()=>setPage("account")}>Already have an account, log in</button>
    </div>
  );

  const passwordResetPage = () => (
    <div className="authContainer">
      <p>Register a new account</p>
      <PasswordReset><PasswordResetForm /></PasswordReset>
      <button className="link-button" onClick={()=>setPage("account")}>log in</button>
    </div>
  );

  const updatePage = () => (
    <div className="authContainer">
      <p>Change your email address</p>
      <UpdateEmailForm />
      <button className="link-button" onClick={()=>setPage("account")}>Back to profile</button>
    </div>
  );

  const updateProfilePage = () => (
    <div className="authContainer">
      <p>Change your Profile</p>
      <UpdateProfileForm />
      <button className="link-button" onClick={()=>setPage("account")}>Back to profile</button>
    </div>
  );

  const changePasswordPage = () => (
    <div className="authContainer">
      <p>Set a new password</p>
      <ChangePasswordForm />
      <button className="link-button" onClick={()=>setPage("account")}>Back to profile</button>
    </div>
  );
  
  const mfaPage = () => (
    <div>
      <p>You need to enter an MFA, but this library does not yet support them.</p>
    </div>
  );

  switch (state) {
    case CognitoState.LOGGED_IN:
      switch (pname) {
        case 'change_email':
          return updatePage();
        case 'change_password':
          return changePasswordPage();  
        case 'change_profile':
          return updateProfilePage();  
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
        case 'register':
          return registerPage();
        case 'reset':
          return passwordResetPage();  
        default:
          return loggedOutPage();
      }
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
