import { Dispatch, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStore, Store, applyMiddleware, compose } from "redux";
import { Actions, Game, GameReducer } from "@fishbowl/common";

//@ts-ignore: devtools setup
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const createGameStore = (
  game: Game,
  middleware: (action: Actions) => void
) => {
  return createStore(
    GameReducer,
    game,
    composeEnhancers(
      applyMiddleware(() => (next) => (action: Actions) => {
        middleware(action);
        next(action);
      })
    )
  );
};

export const useActionDispatch = () => useDispatch<Dispatch<Actions>>();
export const useGameSelector = <TReturn>(selector: (g: Game) => TReturn) =>
  useSelector<Game, TReturn>(selector);
