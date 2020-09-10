import React from 'react';
import Routes from "./routes";
import { NavLink as NavLinkRRD, Link, withRouter, useHistory } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import './index.css';

import "assets/css/styles.css";

function App() {
  return (
    <div className="App container">
    <div className="banner">
        <img alt="Geo Canada" className="logo-bar" src={require('assets/logo.png')} />
        <h3 className="text-bar">GEO CANADA</h3>
    </div>
      <Routes />
    </div>
  );
}

export default withRouter(App);
