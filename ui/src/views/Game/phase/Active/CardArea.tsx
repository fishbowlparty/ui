import { selectActivePlayer, selectCards } from "@fishbowl/common";
import { Box, Typography } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { Recap } from "./Recap";

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
        <CardTitle center>{`${
          isMyTurn ? "You" : activePlayer.name
        } paused the timer.`}</CardTitle>
      </Centered>
    );
  }

  if (isMyTurn) {
    return (
      <Centered>
        <Typography variant="h4" align="center">
          {activeCard?.text}
        </Typography>
      </Centered>
    );
  }

  return (
    <Centered>
      <CardTitle center>
        {`${activePlayer.name} is giving clues. Pay attention!`}
      </CardTitle>
    </Centered>
  );
};

const Centered: React.FC = ({ children }) => (
  <>
    <Flex flex="1 1 0%"></Flex>
    {children}
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
