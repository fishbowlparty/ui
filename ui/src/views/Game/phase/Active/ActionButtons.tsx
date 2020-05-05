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

export const ActionButtons: React.FC = () => {
  const { id } = getPlayer();

  const activePlayer = useGameSelector(selectActivePlayer);

  const isMyTurn = activePlayer.id === id;
  const isTurnFresh = useGameSelector((game) => game.turns.active.isFresh);
  const isPaused = useGameSelector((game) => game.turns.active.paused);
  const skipPenalty = useGameSelector((game) => game.settings.skipPenalty);
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
    if (activeCard == null) {
      return;
    }
    dispatch({
      type: "SKIP_CARD",
      payload: { cardId: activeCard.id, drawSeed: Math.random() },
    });
    if (skipPenalty < 0) {
      setMinusOnes((minusOnes) => ({ ...minusOnes, [v4()]: true }));
    }
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
    setPlusOnes((plusOnes) => ({
      ...plusOnes,
      [v4()]: true,
    }));
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
          {Object.keys(minusOnes).map((id) => (
            <AnimatedFlyout key={id} onAnimationEnd={() => removePlusOne(id)}>
              -1
            </AnimatedFlyout>
          ))}
        </Button>
      </Flex>
      <Flex flex="2 2 0%" marginLeft={`${theme.spacing(1)}px`}>
        <Button variant="outlined" fullWidth color="primary" onClick={gotCard}>
          Got It!
          {Object.keys(plusOnes).map((id) => (
            <AnimatedFlyout key={id} onAnimationEnd={() => removePlusOne(id)}>
              +1
            </AnimatedFlyout>
          ))}
        </Button>
      </Flex>
    </Flex>
  );
};

const fly = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-40px) scale(0.8);
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-80px) scale(1.4);
  }
`;

const AnimationWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Animation = styled.div`
  animation: ${fly} 100s ease-out;
`;

const AnimatedFlyout: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <AnimationWrapper {...props}>
      <Animation>{children}</Animation>
    </AnimationWrapper>
  );
};
