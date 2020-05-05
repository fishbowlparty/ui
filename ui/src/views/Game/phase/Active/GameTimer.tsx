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
  const activePlayer = useGameSelector(selectActivePlayer);

  const isMyTurn = activePlayer.id === id;
  const isTurnFresh = useGameSelector((game) => game.turns.active.isFresh);
  const isGameFresh = useGameSelector((game) => game.isFresh);
  const isPaused = useGameSelector((game) => game.turns.active.paused);
  const timer = useTimerContext();

  const togglePause = useCallback(() => {
    if (isPaused) {
      dispatch({ type: "RESUME_TURN", payload: { playerId: activePlayer.id } });
    } else {
      dispatch({
        type: "PAUSE_TURN",
        payload: { playerId: activePlayer.id, timeRemaining: timer },
      });
    }
  }, [dispatch, timer, isPaused, activePlayer]);

  // can only use the button when its your turn and turn is not fresh
  const isDisabled = isTurnFresh || !isMyTurn;

  // never show -1
  const timeRemaining = timer < 0 ? "Time's up!" : timer;

  const content =
    !isTurnFresh || isMyTurn ? (
      timeRemaining
    ) : isGameFresh ? (
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
