import { ThemeProvider } from "@material-ui/core";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { theme } from "./theme";
import { Home } from "./views/Home";
import { Join } from "./views/Join";
import { GameView } from "./views/Game";
import { initializePlayerId } from "./redux/localStorage";
import { Grid } from "./components/Layout";

export const App = () => {
  useEffect(() => {
    initializePlayerId();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Grid>
          <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/join" exact component={Join}></Route>
            <Route path="/games/:gameCode" component={GameView}></Route>
            <Route path="/" component={FourOhFour}></Route>
          </Switch>
        </Grid>
      </Router>
    </ThemeProvider>
  );
};

const FourOhFour = () => <div>404 NOT FOUND</div>;
