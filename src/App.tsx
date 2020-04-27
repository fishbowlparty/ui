import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { theme } from "./theme";
import { Home } from "./views/Home";
import { Create } from "./views/Create";
import { Join } from "./views/Join";
import { Game } from "./views/Game";

export const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/create" exact component={Create}></Route>
        <Route path="/join" exact component={Join}></Route>
        <Route path="/games/:id" exact component={Game}></Route>
      </Switch>
    </Router>
  </ThemeProvider>
);
