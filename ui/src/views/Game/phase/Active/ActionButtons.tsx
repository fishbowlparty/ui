import { selectActivePlayer } from "@fishbowl/common";
import { Button, Slide } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback } from "react";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { useTimerContext } from "./timer";
import { StickyButtonFooter } from "../../components/StickyButtonFooter";
import { Footer } from "../../../../components/Layout";

export const ActionButtons: React.FC = () => {
  const { id } = getPlayer();

  const activePlayer = useGameSelector(selectActivePlayer);

  const isMyTurn = activePlayer.id === id;
  const isTurnFresh = useGameSelector((game) => game.turns.active.isFresh);
  const isTimeFull = useGameSelector(
    (game) => game.settings.turnDuration === game.turns.active.timeRemaining
  );
  const isPaused = useGameSelector((game) => game.turns.active.paused);
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

  const skipCard = useCallback(() => {
    dispatch({
      type: "SKIP_CARD",
      payload: { cardId: activeCardId, drawSeed: Math.random() },
    });
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
    return <Flex height="69px"></Flex>;
  }

  if (isTurnFresh) {
    return (
      <Footer>
        {isTimeFull && (
          <Flex flex="1 1 auto" marginRight={`${theme.spacing(1)}px`}>
            <Button variant="outlined" fullWidth onClick={skipTurn}>
              Skip Turn
            </Button>
          </Flex>
        )}
        <Flex flex="1 1 auto" marginLeft={`${theme.spacing(1)}px`}>
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            onClick={startTurn}
          >
            Start Turn
          </Button>
        </Flex>
      </Footer>
    );
  }

  if (isPaused) {
    return (
      <Footer>
        <Button
          variant="outlined"
          fullWidth
          color="primary"
          onClick={resumeTurn}
        >
          Resume Turn
        </Button>
      </Footer>
    );
  }

  return (
    <Footer>
      <Flex flex="1 1 auto" marginRight={`${theme.spacing(1)}px`}>
        <Button
          variant="outlined"
          fullWidth
          onClick={skipCard}
          disabled={cantSkip}
        >
          Skip
        </Button>
      </Flex>
      <Flex flex="2 2 auto" marginLeft={`${theme.spacing(1)}px`}>
        <Button variant="outlined" fullWidth color="primary" onClick={gotCard}>
          Got It!
        </Button>
      </Flex>
    </Footer>
  );
};
