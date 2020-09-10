import React, { useState } from "react";
import ReactDOM from "react-dom";
// react library for routing
import { BrowserRouter as Router, Route, IndexRoute, Switch, Redirect, withRouter } from "react-router-dom";

import App from './App';

ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.getElementById('root')
  );
