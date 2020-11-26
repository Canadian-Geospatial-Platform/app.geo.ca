import React from 'react';
import Routes from "./routes";
import { NavLink as NavLinkRRD, Link, withRouter, useHistory } from "react-router-dom";
import './App.css';
import './index.css';

import "assets/css/styles.css";

function App() {
  return (
    <div className="container-fluid p-0">
    <div>
      <Routes />
    </div>
    </div>
  );
}

export default withRouter(App);
