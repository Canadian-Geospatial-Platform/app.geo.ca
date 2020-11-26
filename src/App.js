import React from 'react';
import Routes from "./routes";
import { NavLink as NavLinkRRD, Link, withRouter, useHistory } from "react-router-dom";
import './App.css';
import './index.css';

import "assets/css/styles.css";

function App() {
  return (
    <div className="container-fluid p-0">
    {/* <div className="banner">
        <img alt="Geo Canada" className="logo-bar" src={require('assets/logo.jpg')} />
    </div> */}
    <div>
      <Routes />
    </div>
    </div>
  );
}

export default withRouter(App);
