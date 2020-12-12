import React from 'react';
import { 
  //NavLink as NavLinkRRD, 
  BrowserRouter as Router, 
  Route, 
  //Link, 
  //withRouter, 
  //useHistory 
  } from "react-router-dom";
import Main from "./en/main.jsx";
// css
import './App.css';
import './index.css';
import "./assets/css/styles.css";

const App = () => {
  return (
    <Router>
    <div className="container-fluid p-0">
      <Route exact path="/" component={Main} />
    </div>
    </Router>
    );
}
export default App;