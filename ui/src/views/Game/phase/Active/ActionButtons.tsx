import { selectActivePlayer, selectCards } from "@fishbowl/common";
import { Button } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback } from "react";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { useTimerContext } from "./timer";

export const ActionButtons: React.FC = () => {
  const { id } = getPlayer();

  const activePlayer = useGameSelector(selectActivePlayer);

  const isMyTurn = activePlayer.id === id;
  const isTurnFresh = useGameSelector((game) => game.turns.active.isFresh);
  const isPaused = useGameSelector((game) => game.turns.active.paused);
  const activeCard = useGameSelector(
    (game) => selectCards(game)[game.turns.active.activeCardId]
  );
  const cantSkip = useGameSelector((game) => {
    const { activeCardId, skippedCardIds } = game.turns.active;
    const [firstSkipId, ...rest] = Object.keys(skippedCardIds);

    return rest.length == 0 && firstSkipId === activeCardId;
  });
  const timeRemaining = useTimerContext();

  const dispatch = useActionDispatch();

  const skipCard = useCallback(() => {
    if (activeCard == null) {
      return;
    }
    dispatch({
      type: "SKIP_CARD",
      payload: { cardId: activeCard.id, drawSeed: Math.random() },
    });
  }, [dispatch, activeCard]);
  const gotCard = useCallback(() => {
    if (activeCard == null) {
      return;
    }
    dispatch({
      type: "GOT_CARD",
      payload: {
        cardId: activeCard.id,
        timeRemaining,
        drawSeed: Math.random(),
      },
    });
  }, [dispatch, activeCard, timeRemaining]);

  const skipTurn = useCallback(() => {
    dispatch({ type: "SKIP_TURN", payload: { playerId: activePlayer.id } });
  }, [dispatch, activePlayer]);
  const startTurn = useCallback(() => {
    dispatch({
      type: "START_TURN",
      payload: { drawSeed: Math.random(), playerId: activePlayer.id },
    });
  }, [dispatch, activePlayer]);
  const resumeTurn = useCallback(() => {
    dispatch({ type: "RESUME_TURN", payload: { playerId: activePlayer.id } });
  }, [dispatch, activePlayer]);

  if (!isMyTurn) {
    // placeholder to avoid layout thrashing when buttons disappear
    return <Flex height="36px"></Flex>;
  }

  if (isTurnFresh) {
    return (
      <Flex>
        <Flex flex="1 1 0%" marginRight={`${theme.spacing(1)}px`}>
          <Button variant="outlined" fullWidth onClick={skipTurn}>
            Skip Turn
          </Button>
        </Flex>
        <Flex flex="1 1 0%" marginLeft={`${theme.spacing(1)}px`}>
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            onClick={startTurn}
          >
            Start Turn
          </Button>
        </Flex>
      </Flex>
    );
  }

  if (isPaused) {
    return (
      <Flex>
        <Button
          variant="outlined"
          fullWidth
          color="primary"
          onClick={resumeTurn}
        >
          Resume Turn
        </Button>
      </Flex>
    );
  }

  return (
    <Flex>
      <Flex flex="1 1 0%" marginRight={`${theme.spacing(1)}px`}>
        <Button
          variant="outlined"
          fullWidth
          onClick={skipCard}
          disabled={cantSkip}
        >
          Skip
        </Button>
      </Flex>
      <Flex flex="2 2 0%" marginLeft={`${theme.spacing(1)}px`}>
        <Button variant="outlined" fullWidth color="primary" onClick={gotCard}>
          Got It!
        </Button>
      </Flex>
    </Flex>
  );
};
