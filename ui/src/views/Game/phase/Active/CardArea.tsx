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
import { ScoreSprinkler } from "./ScoreSprinkler";

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

  return (
    <Flex
      flexDirection="column"
      flex="1 0 auto"
      style={{ position: "relative" }}
    >
      {/* <ScoreSprinkler></ScoreSprinkler> */}
      <Centered>
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
    </Flex>
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
