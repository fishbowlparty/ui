import { Dispatch, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import { GameReducer } from "./reducer";
import { Actions, Game } from "./types";

export const useGameStore = (game?: Game) => createStore(GameReducer, game);

export const useActionDispatch = () => useDispatch<Dispatch<Actions>>();
export const useGameSelector = <TReturn>(selector: (g: Game) => TReturn) =>
  useSelector<Game, TReturn>(selector);
