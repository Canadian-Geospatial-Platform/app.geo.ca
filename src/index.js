import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
// react library for routing
//import { BrowserRouter as Router, Route, IndexRoute, Switch, Redirect, withRouter } from "react-router-dom";
import { combineReducers, createStore } from 'redux';
import { setupCognito, cognito } from 'react-cognito';

import App from './App';
import config from './cognito-auth/config.json';
//import { render } from "@testing-library/react";

const reducers = combineReducers({
    cognito,
});

//let store = createStore(reducers);
let store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
// config.group = 'admins'; // Uncomment this to require users to be in a group 'admins'
setupCognito(store, config);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root'));
