import React, { useContext, useState, useRef, useEffect } from "react";
import { useGameSelector, useActionDispatch } from "../../../../redux";
const TimerContext = React.createContext<number>(0);

export const TimerContextProvider: React.FC = ({ children }) => {
  const dispatch = useActionDispatch();
  const paused = useGameSelector((game) => game.turns.active.paused);
  const timeRemaining = useGameSelector(
    (game) => game.turns.active.timeRemaining
  );
  const [timer, setTimer] = useState(timeRemaining);
  const interval = useRef<number>();

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
      dispatch({ type: "END_TURN", payload: {} });
    }
  }, [dispatch, timer]);

  return (
    <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>
  );
};

export const useTimerContext = () => useContext(TimerContext);
