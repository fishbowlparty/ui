import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
import { useGameSelector, useActionDispatch } from "../../../../redux";
import { selectActivePlayer } from "@fishbowl/common";
const TimerContext = React.createContext<number>(0);

export const TimerContextProvider: React.FC = ({ children }) => {
  const dispatch = useActionDispatch();
  const paused = useGameSelector((game) => game.turns.active.paused);
  const timeRemaining = useGameSelector(
    (game) => game.turns.active.timeRemaining
  );
  const activePlayer = useGameSelector(selectActivePlayer);
  const pauseSound = useMemo(
    () =>
      new Audio(
        "https://www.noiseforfun.com/waves/interface-and-media/NFF-trill.wav"
      ),
    []
  );

  const [timer, setTimer] = useState(timeRemaining);
  const interval = useRef<number>();

  // play pause sound whenever the paused state toggles
  const wasPaused = useRef(true);
  useEffect(() => {
    if (wasPaused.current !== paused) {
      pauseSound.play();
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
