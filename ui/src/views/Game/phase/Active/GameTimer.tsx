import { Box, Button, Typography } from "@material-ui/core";
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

export const GameTimer: React.FC = () => {
  const { id } = getPlayer();
  const dispatch = useActionDispatch();
  const isNewTurn = useGameSelector(selectIsNewTurn);
  const isNewGame =
    useGameSelector((game) => game.turns.recap == null) && isNewTurn;
  const isMyTurn = useGameSelector(
    (game) => selectActivePlayer(game).id === id
  );
  const paused = useGameSelector((game) => game.turns.active.paused);
  const timer = useTimerContext();

  const onClick = useCallback(() => {
    if (paused) {
      dispatch({ type: "START_TURN", payload: { drawSeed: Math.random() } });
    } else {
      dispatch({ type: "PAUSE_TURN", payload: { timeRemaining: timer } });
    }
  }, [dispatch, timer, paused]);

  if (isNewGame) {
    return null;
  }

  if (isNewTurn) {
    return (
      <Typography variant="h4" align="center">
        Time's up!
      </Typography>
    );
  }
  if (isMyTurn) {
    return (
      <Button variant="outlined" fullWidth onClick={onClick}>
        <Flex flexDirection="column" alignItems="center">
          <Typography variant="caption" align="center" color="textSecondary">
            Time Remaining
          </Typography>
          <Typography
            variant="h2"
            style={{ fontWeight: "bold" }}
            color="textSecondary"
          >
            {timer}
          </Typography>
          <Typography variant="caption" align="center" color="textSecondary">
            {paused ? "paused" : "tap to pause"}
          </Typography>
        </Flex>
      </Button>
    );
  }
  return (
    <Flex flexDirection="column" alignItems="center">
      <Typography variant="caption" align="center" color="textSecondary">
        Time Remaining
      </Typography>
      <Typography
        variant="h2"
        style={{ fontWeight: "bold" }}
        color="textSecondary"
      >
        {timer}
      </Typography>
      <Typography variant="caption" align="center" color="textSecondary">
        {paused ? "paused" : <span>&nbsp;</span>}
      </Typography>
    </Flex>
  );
};
