import React, {useState}  from 'react';
//import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useStore } from 'react-redux';
import { updateAttributes } from 'react-cognito';

const UpdateProfileForm = () => {
  const store = useStore();
  const state = store.getState();
  const [emailAddr, setEmail] = useState(state.cognito.attributes.email);
  const [fname, setFname] = useState(state.cognito.attributes.given_name);
  const [lname, setLname] = useState(state.cognito.attributes.family_name);
  const [org, setOrg] = useState(state.cognito.attributes['custom:org']);
  const [address, setAddress] = useState(state.cognito.attributes.address);
  const [city, setCity] = useState(state.cognito.attributes['custom:city']);
  const [prov, setProv] = useState(state.cognito.attributes['custom:prov']);
  const [postalcode, setZip] = useState(state.cognito.attributes['custom:postal_code']);
  const [phone, setPhone] = useState(state.cognito.attributes.phone_number);
  const [stateError, setError] = useState({error:""});

  const onSubmit = (event) => {
    //const { store } = this.context;
    //const state = store.getState();
    const user = state.cognito.user;
    const config = state.cognito.config;
    event.preventDefault();
    updateAttributes(user, {
        'family_name': lname,
        'given_name': fname,
        'address': address,
        'phone_number': phone,
        'custom:org': org,
        'custom:city': city,
        'custom:prov': prov,
        'custom:postal_code': postalcode
    }, config).then(
      (action) => {
        store.dispatch(action);
        setError({error:'email changed'});
      },
      error => setError({ error }),
    );
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
          <span>First Name</span>
          <input placeholder="first name" value={fname} onChange={changeFname} required />
        </label>
        <label>
          <span>Last Name</span>
          <input placeholder="last name" value={lname} onChange={changeLname} required />
        </label>
        <label>
          <span>Org.</span>
          <input placeholder="org." value={org} onChange={changeOrg} required />
        </label>
        <label>
          <span>Address</span>
          <input placeholder="address" value={address} onChange={changeAddress} required />
        </label>
        <label>
          <span>City</span>
          <input placeholder="city" value={city} onChange={changeCity} required />
        </label>
        <label>
          <span>Provice</span>
          <input placeholder="provice" value={prov} onChange={changeProv} required />
        </label>
        <label>
          <span>Postal Code</span>
          <input placeholder="postal code" value={postalcode} onChange={changeZip} required />
        </label>
        <label>
          <span>Phone Number</span>
          <input placeholder="phone" value={phone} onChange={changePhone} required />
        </label>
        <button className="btn-button" type="button" onClick={onSubmit}>Update</button>
      </div>
  )
}
/*UpdateEmailForm.contextTypes = {
  store: PropTypes.object,
};*/

export default UpdateProfileForm;
