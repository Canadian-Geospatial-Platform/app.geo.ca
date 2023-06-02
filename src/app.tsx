import React from "react";
import ReactDOM from "react-dom";
import { combineReducers, createStore, StoreEnhancer } from "redux";
import { loadState, saveState } from "./reducers/localStorage";
import { RenderMap } from "./render-map";
import mappingReducer from "./reducers/reducer";
import { Provider } from "react-redux";
import { TypeWindow } from "geoview-core-types";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import i18n from "./assets/i18n/i18n";
import { I18nextProvider } from "react-i18next";
const w = window as TypeWindow;
// get reference to geoview apis
const cgpv = w["cgpv"];

const persistedState: StoreEnhancer<unknown, unknown> | undefined = loadState();
const reducers = combineReducers({
  // cognito,
  mappingReducer,
});
// const store = createStore(reducers);
const store = createStore(reducers, persistedState);

const Routing = () => {
  return (
    <Router>
      {/* <StrictMode> */}
      <Switch>
        <Route exact path="/" component={RenderMap} />
      </Switch>
      {/* </StrictMode> */}
    </Router>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <Routing />
    </I18nextProvider>
  </Provider>,
  document.getElementById("root")
);
