import {
  Box,
  Button,
  Typography,
  IconButton,
  ButtonBase,
} from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import {
  selectActivePlayer,
  selectCards,
  selectIsNewTurn,
} from "@fishbowl/common";
import { getPlayer } from "../../../../redux/localStorage";

import { theme } from "../../../../theme";
import { useTimerContext } from "./timer";
import { PlayArrow, Pause } from "@material-ui/icons";

export const GameTimer: React.FC = () => {
  const { id } = getPlayer();
  const dispatch = useActionDispatch();
  const isNewTurn = useGameSelector(selectIsNewTurn);
  const isNewGame =
    useGameSelector((game) => game.turns.recap == null) && isNewTurn;
  const isMyTurn = useGameSelector(
    (game) => selectActivePlayer(game).id === id
  );
  const isPaused = useGameSelector((game) => game.turns.active.paused);
  const timer = useTimerContext();

  const togglePause = useCallback(() => {
    if (isPaused) {
      dispatch({ type: "START_TURN", payload: { drawSeed: Math.random() } });
    } else {
      dispatch({ type: "PAUSE_TURN", payload: { timeRemaining: timer } });
    }
  }, [dispatch, timer, isPaused]);

  const isDisabled = isNewTurn || !isMyTurn;
  const timesUp = isNewTurn || timer < 0;

  return (
    <ButtonBase
      style={{
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
      disabled={isDisabled}
      onClick={togglePause}
    >
      <Flex flex="1 0 auto">
        <Flex flex="1 1 0%"></Flex>
        <Typography
          variant="h4"
          style={{ fontWeight: "bold" }}
          color="textSecondary"
        >
          {isNewGame ? <span>&nbsp;</span> : timesUp ? "Time's up!" : timer}
        </Typography>
        <Flex flex="1 1 0%" justifyContent="flex-end" alignItems="flex-start">
          <Typography color="textSecondary">
            {!isDisabled &&
              (isPaused ? <PlayArrow></PlayArrow> : <Pause></Pause>)}
          </Typography>
        </Flex>
      </Flex>
    </ButtonBase>
  );
};
