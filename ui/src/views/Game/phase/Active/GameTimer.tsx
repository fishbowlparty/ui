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
  const isFresh = useGameSelector((game) => game.turns.active.isFresh);
  const isNewGame =
    useGameSelector((game) => game.turns.recap == null) && isNewTurn;
  const isMyTurn = useGameSelector(
    (game) => selectActivePlayer(game).id === id
  );
  const isPaused = useGameSelector((game) => game.turns.active.paused);
  const timer = useTimerContext();

  const togglePause = useCallback(() => {
    if (isPaused) {
      dispatch({ type: "RESUME_TURN", payload: {} });
    } else {
      dispatch({ type: "PAUSE_TURN", payload: { timeRemaining: timer } });
    }
  }, [dispatch, timer, isPaused]);

  // can only use the button when its your turn and turn is not fresh
  const isDisabled = isFresh || !isMyTurn;

  // never show -1
  const timeRemaining = timer < 0 ? "Time's up!" : timer;

  const content =
    !isFresh || isMyTurn ? (
      timeRemaining
    ) : isNewGame ? (
      <span>&nbsp;</span>
    ) : (
      "Time's up!"
    );

  /*
  If it is my turn, show time remaining
  If it is a new game, show nothing
  If it is is fresh, show end of turn
  show timeer
  */
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
          style={{
            fontWeight: "bold",
            color: isDisabled
              ? theme.palette.text.disabled
              : theme.palette.text.secondary,
          }}
        >
          {content}
        </Typography>
        <Flex flex="1 1 0%" justifyContent="flex-end" alignItems="flex-start">
          <Typography color="textSecondary">
            {!isDisabled &&
              (isPaused ? (
                <PlayArrow style={{ fontSize: 16 }} />
              ) : (
                <Pause style={{ fontSize: 16 }} />
              ))}
          </Typography>
        </Flex>
      </Flex>
    </ButtonBase>
  );
};
