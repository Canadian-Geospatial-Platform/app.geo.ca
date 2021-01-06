import React, {useState} from 'react';
//import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
//import { withRouter } from 'react-router';
import { registerUser } from 'react-cognito';

const RegisterForm = () => {
  const store = useStore();
  const state = store.getState();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailAddr, setEmail] = useState("");
  const [stateError, setError] = useState({error:""});

  const onSubmit = (event) => {
    //const { store } = this.context;
    //const state = store.getState();
    const userPool = state.cognito.userPool;
    const config = state.cognito.config;
    event.preventDefault();
    registerUser(userPool, config, username, password, {
      email: emailAddr,
    }).then(
      (action) => {
        store.dispatch(action);
        history.push('/#account');
      },
      error => setError({ error }));
  }

  const changeUsername = (event) => {
    setUsername(event.target.value);
  }

  const changePassword = (event) => {
    setPassword(event.target.value);
  }

  const changeEmail = (event) => {
    setEmail(event.target.value);
  }

  return (
      <div className="authForm">
        <div className="errMessage">{stateError.error}</div>
        <label>
          <span>Username</span>
          <input placeholder="username" onChange={changeUsername} required />
        </label>
        <label>
          <span>Password</span>
          <input placeholder="password" onChange={changePassword} required />
        </label>
        <label>
          <span>Email Address</span>
          <input placeholder="email" type="email" onChange={changeEmail} required />
        </label>
        <button className="btn-button" type="button" onClick={onSubmit}>Register</button>
      </div>
  )
}
// RegisterForm.contextTypes = {
//   store: PropTypes.object,
// };

export default RegisterForm;

