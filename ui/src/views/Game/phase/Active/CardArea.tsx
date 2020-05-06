import { selectActivePlayer, selectCards } from "@fishbowl/common";
import { Box, Typography } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useEffect, useState, useCallback } from "react";
import { useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { Recap } from "./Recap";
import {
  usePlusMinusAnimation,
  AnimatedFlyout,
  Score,
} from "../../../../components/Typography";
import { v4 } from "uuid";

const badTurnPhrases = [
  "sooooo, you get what we're doing here, right?",
  "yikes",
  "(╯°□°)╯︵ ┻━┻",
  "don't worry, it wasn't your fault",
  "I'm not mad, I'm just disappointed",
];

export const CardArea: React.FC = () => {
  const { id } = getPlayer();

  const isTurnFresh = useGameSelector((game) => game.turns.active.isFresh);
  const isGameFresh = useGameSelector((game) => game.isFresh);
  const activePlayer = useGameSelector(selectActivePlayer);

  const isMyTurn = activePlayer.id === id;
  const activeCard = useGameSelector(
    (game) => selectCards(game)[game.turns.active.activeCardId]
  );
  const isPaused = useGameSelector((game) => game.turns.active.paused);
  const cardEvents = useGameSelector((game) => game.turns.recap.cardEvents);
  const { AnimatedPlusOnes, AnimatedMinusOnes } = usePlusMinusAnimation(
    "medium"
  );

  const [plusOnes, setPlusOnes] = useState<Record<string, boolean>>({});
  const [minusOnes, setMinusOnes] = useState<Record<string, boolean>>({});

  const addPlusOne = useCallback(
    () => setPlusOnes((plusOnes) => ({ ...plusOnes, [v4()]: true })),
    [setPlusOnes]
  );
  const removePlusOne = useCallback(
    (id: string) => {
      setPlusOnes((plusOnes) => {
        const { [id]: _, ...rest } = plusOnes;
        return rest;
      });
    },
    [setPlusOnes]
  );

  const addMinusOne = useCallback(
    () => setMinusOnes((minusOnes) => ({ ...minusOnes, [v4()]: true })),
    [setMinusOnes]
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

  useEffect(() => {
    if (cardEvents.length == 0) {
      return;
    }
    const lastEvent = cardEvents[cardEvents.length - 1];
    if (lastEvent == null) {
      addMinusOne();
    } else {
      addPlusOne();
    }
  }, [cardEvents]);

  return (
    <Centered>
      {Object.keys(plusOnes).map((id) => (
        <AnimatedFlyout key={id} onAnimationEnd={() => removePlusOne(id)}>
          <Score>+ 1</Score>
        </AnimatedFlyout>
      ))}
      {Object.keys(minusOnes).map((id) => (
        <AnimatedFlyout key={id} onAnimationEnd={() => removeMinusOne(id)}>
          <Score>- 1</Score>
        </AnimatedFlyout>
      ))}
      {isGameFresh ? (
        <CardTitle center>
          {isMyTurn
            ? "You're up first. Start the turn whenever you're ready."
            : `Waiting for ${activePlayer.name} to start the game`}
        </CardTitle>
      ) : isTurnFresh ? (
        <>
          <CardTitle>Turn recap</CardTitle>
          <Box mb={1}></Box>
          <Recap></Recap>
        </>
      ) : isPaused ? (
        <CardTitle center>{`${
          isMyTurn ? "You" : activePlayer.name
        } paused the timer.`}</CardTitle>
      ) : isMyTurn ? (
        <Typography variant="h4" align="center">
          {activeCard?.text}
        </Typography>
      ) : (
        <CardTitle center>
          {`${activePlayer.name} is giving clues. Pay attention!`}
        </CardTitle>
      )}
    </Centered>
  );

  // Brand new game
  if (isGameFresh) {
    return (
      <Centered>
        <CardTitle center>
          {isMyTurn
            ? "You're up first. Start the turn whenever you're ready."
            : `Waiting for ${activePlayer.name} to start the game`}
        </CardTitle>
      </Centered>
    );
  }

  // End of a turn
  if (isTurnFresh) {
    return (
      <Centered>
        <CardTitle>Turn recap</CardTitle>
        <Box mb={1}></Box>
        <Recap></Recap>
      </Centered>
    );
  }

  if (isPaused) {
    return (
      <Centered>
        <AnimatedPlusOnes />
        <AnimatedMinusOnes />
        <CardTitle center>{`${
          isMyTurn ? "You" : activePlayer.name
        } paused the timer.`}</CardTitle>
      </Centered>
    );
  }

  if (isMyTurn) {
    return (
      <Centered>
        <AnimatedPlusOnes />
        <AnimatedMinusOnes />
        <Typography variant="h4" align="center">
          {activeCard?.text}
        </Typography>
      </Centered>
    );
  }

  return (
    <Centered>
      <AnimatedPlusOnes />
      <AnimatedMinusOnes />
      <CardTitle center>
        {`${activePlayer.name} is giving clues. Pay attention!`}
      </CardTitle>
    </Centered>
  );
};

const Centered: React.FC = ({ children }) => (
  <>
    <Flex flex="1 1 0%"></Flex>
    <Flex flexDirection="column" style={{ position: "relative" }}>
      {children}
    </Flex>
    <Flex flex="2 2 0%"></Flex>
  </>
);

const CardTitle: React.FC<{ center?: boolean }> = ({ children, center }) => (
  <Typography
    align={center ? "center" : "left"}
    variant="h6"
    style={{ fontWeight: 300 }}
    color="textSecondary"
  >
    {children}
  </Typography>
);
