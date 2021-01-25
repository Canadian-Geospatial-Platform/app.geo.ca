import React, {useState} from 'react';
//import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import { registerUser } from 'react-cognito';
import axios from "axios";
//import { LinkedCameraTwoTone } from '@material-ui/icons';

const RegisterForm = () => {
  const store = useStore();
  const state = store.getState();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailAddr, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [org, setOrg] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [prov, setProv] = useState("");
  const [postalcode, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [stateError, setError] = useState({error:""});

  const onSubmit = (event) => {
    //const { store } = this.context;
    //const state = store.getState();
    const userPool = state.cognito.userPool;
    const config = state.cognito.config;
    const regData = {
        "email": emailAddr,
        "family_name": lname,
        "given_name": fname,
        "address": address,
        "phone_number": phone,
        "custom:org": org,
        "custom:city": city,
        "custom:prov": prov,
        "custom:postal_code": postalcode
    };
    const dbData = {
        "email": emailAddr,
        "fname": fname,
        "lname": lname, 
        "org": org, 
        "address": address,
        "city": city,
        "prov": prov,
        "postal_code": postalcode,
        "phone": phone
    };
    event.preventDefault();
    registerUser(userPool, config, username, password, regData).then(
      (action) => {
        store.dispatch(action);
        changeDB(dbData);
        history.push('/#account');
      },
      error => setError({ error }));
  }

  const changeDB = (data) => {
    const api = 'https://w3f1qdahx4.execute-api.ca-central-1.amazonaws.com/staging';
    axios.post(api, data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const changeFname = (event) => {
    setFname(event.target.value);
  }

  const changeLname = (event) => {
    setLname(event.target.value);
  }

  const changeOrg = (event) => {
    setOrg(event.target.value);
  }

  const changeAddress = (event) => {
    setAddress(event.target.value);
  }

  const changeCity = (event) => {
    setCity(event.target.value);
  }

  const changeProv = (event) => {
    setProv(event.target.value);
  }

  const changeZip = (event) => {
    setZip(event.target.value);
  }

  const changePhone = (event) => {
    setPhone(event.target.value);
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
        <label>
          <span>First Name</span>
          <input placeholder="first name" onChange={changeFname} required />
        </label>
        <label>
          <span>Last Name</span>
          <input placeholder="last name" onChange={changeLname} required />
        </label>
        <label>
          <span>Org.</span>
          <input placeholder="org." onChange={changeOrg} required />
        </label>
        <label>
          <span>Address</span>
          <input placeholder="address" onChange={changeAddress} required />
        </label>
        <label>
          <span>City</span>
          <input placeholder="city" onChange={changeCity} required />
        </label>
        <label>
          <span>Provice</span>
          <input placeholder="provice" onChange={changeProv} required />
        </label>
        <label>
          <span>Postal Code</span>
          <input placeholder="postal code" onChange={changeZip} required />
        </label>
        <label>
          <span>Phone Number</span>
          <input placeholder="phone" onChange={changePhone} required />
        </label>
        <button className="btn-button" type="button" onClick={onSubmit}>Register</button>
      </div>
  )
}
// RegisterForm.contextTypes = {
//   store: PropTypes.object,
// };

export default RegisterForm;

