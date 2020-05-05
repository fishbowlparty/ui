import { selectActivePlayer, selectCards } from "@fishbowl/common";
import { Button } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useState, DetailedHTMLProps } from "react";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { useTimerContext } from "./timer";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";
import { v4 } from "uuid";
import { AnimatedFlyout, Score } from "../../../../components/Typography";

export const ActionButtons: React.FC = () => {
  const { id } = getPlayer();

  const activePlayer = useGameSelector(selectActivePlayer);
  const activeTeam = useGameSelector((game) => game.activePlayer.team);

  const isMyTurn = activePlayer.id === id;
  const isTurnFresh = useGameSelector((game) => game.turns.active.isFresh);
  const isPaused = useGameSelector((game) => game.turns.active.paused);
  const skipPenalty = useGameSelector((game) => game.settings.skipPenalty);
  const skippedCardIds = useGameSelector(
    (game) => game.turns.active.skippedCardIds
  );
  const activeCardId = useGameSelector(
    (game) => game.turns.active.activeCardId
  );
  const cantSkip = useGameSelector((game) => {
    const { activeCardId, skippedCardIds } = game.turns.active;
    const [firstSkipId, ...rest] = Object.keys(skippedCardIds);

    return rest.length == 0 && firstSkipId === activeCardId;
  });
  const timeRemaining = useTimerContext();

  const dispatch = useActionDispatch();

  // state to drive animated + / - 1s
  const [plusOnes, setPlusOnes] = useState<Record<string, boolean>>({});
  const [minusOnes, setMinusOnes] = useState<Record<string, boolean>>({});

  const removePlusOne = useCallback(
    (id: string) => {
      setPlusOnes((plusOnes) => {
        const { [id]: _, ...rest } = plusOnes;
        return rest;
      });
    },
    [setPlusOnes]
  );
  const removeMinusOne = useCallback(
    (id: string) => {
      setMinusOnes((minusOnes) => {
        const { [id]: _, ...rest } = minusOnes;
        return rest;
      });
    },
    [setMinusOnes]
  );
  const skipCard = useCallback(() => {
    dispatch({
      type: "SKIP_CARD",
      payload: { cardId: activeCardId, drawSeed: Math.random() },
    });
    if (skipPenalty < 0 && skippedCardIds[activeCardId] == null) {
      setMinusOnes((minusOnes) => ({ ...minusOnes, [v4()]: true }));
    }
  }, [dispatch, activeCardId, skippedCardIds]);
  const gotCard = useCallback(() => {
    dispatch({
      type: "GOT_CARD",
      payload: {
        cardId: activeCardId,
        timeRemaining,
        drawSeed: Math.random(),
      },
    });
    setPlusOnes((plusOnes) => ({
      ...plusOnes,
      [v4()]: true,
    }));
  }, [dispatch, activeCardId, timeRemaining]);

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
          {Object.keys(minusOnes).map((id) => (
            <AnimatedFlyout key={id} onAnimationEnd={() => removeMinusOne(id)}>
              <Score>- 1</Score>
            </AnimatedFlyout>
          ))}
        </Button>
      </Flex>
      <Flex flex="2 2 0%" marginLeft={`${theme.spacing(1)}px`}>
        <Button variant="outlined" fullWidth color="primary" onClick={gotCard}>
          Got It!
          {Object.keys(plusOnes).map((id) => (
            <AnimatedFlyout key={id} onAnimationEnd={() => removePlusOne(id)}>
              <Score>+ 1</Score>
            </AnimatedFlyout>
          ))}
        </Button>
      </Flex>
    </Flex>
  );
};
