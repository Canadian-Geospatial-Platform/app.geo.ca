import React, {useState}  from 'react';
//import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useStore } from 'react-redux';
import { updateAttributes } from 'react-cognito';

const UpdateEmailForm = () => {
  const store = useStore();
  const state = store.getState();
  const [emailAddr, setEmail] = useState(state.cognito.attributes.email);
  const [stateError, setError] = useState({error:""});

  const onSubmit = (event) => {
    //const { store } = this.context;
    //const state = store.getState();
    const user = state.cognito.user;
    const config = state.cognito.config;
    event.preventDefault();
    updateAttributes(user, {
      email: emailAddr,
    }, config).then(
      (action) => {
        store.dispatch(action);
        setError({error:'email changed'});
      },
      error => setError({ error }),
    );
  }

  const changeEmail = (event) => {
    setEmail(event.target.value);
  }

  return (
      <div className="authForm">
        <div className="errMessage">{stateError.error}</div>
        <label>
          <span>Email address</span>
          <input value={emailAddr} onChange={changeEmail} required />
        </label>
        <button className="btn-button" type="button" onClick={onSubmit}>Update</button>
      </div>
  )
}
/*UpdateEmailForm.contextTypes = {
  store: PropTypes.object,
};*/

export default UpdateEmailForm;
