import React from "react";
import { Route, Switch } from "react-router-dom";

import Main from "./en/main.jsx";


export default function Routes({ appProps }) {
  return (
    <Switch>
      <Route path="/" component={Main} />
    </Switch>
  );
}
