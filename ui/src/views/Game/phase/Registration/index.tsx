import React from "react";
import { Switch, Route, useRouteMatch } from "react-router";
import { Rules } from "./Rules";
import { Register } from "./Register";
import { Lobby } from "./Lobby";

export const Registration: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/rules`} exact component={Rules}></Route>
      <Route path={`${path}/register`} exact component={Register}></Route>
      <Route path={path} component={Lobby}></Route>
    </Switch>
  );
};
