import ReactDOM from "react-dom";

import { App } from "./app";
import { Provider } from "react-redux";
import store from "./store";
import { createContext } from "react";
export const AppContext = createContext({ store });
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
