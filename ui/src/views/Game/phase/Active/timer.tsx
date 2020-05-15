import { selectActivePlayer } from "@fishbowl/common";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { useSoundContext } from "../../../../sound";

const TimerContext = React.createContext<number>(0);

export const TimerContextProvider: React.FC = ({ children }) => {
  const dispatch = useActionDispatch();
  const paused = useGameSelector((game) => game.turns.active.paused);
  const timeRemaining = useGameSelector(
    (game) => game.turns.active.timeRemaining
  );
  const activePlayer = useGameSelector(selectActivePlayer);
  const { play } = useSoundContext();

  const [timer, setTimer] = useState(timeRemaining);
  const interval = useRef<number>();

  // play pause sound whenever the paused state toggles
  const wasPaused = useRef(true);
  useEffect(() => {
    if (wasPaused.current && !paused) {
      play("unpause");
    }
    if (!wasPaused.current && paused) {
      play("pause");
    }

    wasPaused.current = paused;
  }, [paused]);

  useEffect(() => {
    setTimer(timeRemaining);
    if (!paused) {
      interval.current = window.setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [paused, timeRemaining]);

  useEffect(() => {
    if (timer < 0) {
      dispatch({ type: "END_TURN", payload: { playerId: activePlayer.id } });
    }
  }, [dispatch, timer]);

  return (
    <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>
  );
};

export const useTimerContext = () => useContext(TimerContext);
