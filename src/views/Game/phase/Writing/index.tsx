import React from "react";
import { Switch, Route, useRouteMatch } from "react-router";
import { WriteCards } from "./WriteCards";
import { Lobby } from "./Lobby";

export const Writing: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/cards`} exact component={WriteCards}></Route>
      <Route path={path} component={Lobby}></Route>
    </Switch>
  );
};
