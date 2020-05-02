import { Dispatch, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStore, Store } from "redux";
import { GameReducer } from "../../../common/reducer";
import { Actions, Game } from "../../../common/types";

export * from "../../../common/types";
export * from "../../../common/selectors";

export const useGameStore = (game?: Game): Store<Game, Actions> =>
  useMemo(
    () =>
      createStore(
        GameReducer,
        game,
        //@ts-ignore: devtools setup
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          //@ts-ignore
          window.__REDUX_DEVTOOLS_EXTENSION__()
      ),
    []
  );
export const useActionDispatch = () => useDispatch<Dispatch<Actions>>();
export const useGameSelector = <TReturn>(selector: (g: Game) => TReturn) =>
  useSelector<Game, TReturn>(selector);
