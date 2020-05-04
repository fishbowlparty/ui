import styled from "@emotion/styled";
import { Box, Button, Typography } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback } from "react";
import { ActionPage } from "../../../components/ActionPage";
import { useActionDispatch, useGameSelector } from "../../../redux";
import { getPlayer } from "../../../redux/localStorage";
import { theme } from "../../../theme";

const placeholders = ["Darth Vader", "Arachnophobia", "Band Camp"];

interface FormState {
  cards: string[];
}

export const Ended: React.FC = () => {
  const { id } = getPlayer();
  const isHost = useGameSelector((game) => game.hostId === id);
  const hostName = useGameSelector((game) => game.players[game.hostId]?.name);
  const dispatch = useActionDispatch();

  const score = useGameSelector((game) => game.score);
  const isTie = score.blue === score.orange;
  const title = isTie
    ? "Tie Game"
    : score.blue > score.orange
    ? "Blue team wins"
    : "Orange team wins";

  const hostInstructions =
    "You can restart this game below - you'll be able to change the rules and add / remove players.";
  const playerInstructions = `Ask ${hostName} to restart the game.`;

  const restartGame = useCallback(
    () => dispatch({ type: "RESTART_GAME", payload: {} }),
    []
  );

  return (
    <ActionPage
      title={title}
      instructions={`Great game everyone! Want to play again? ${
        isHost ? hostInstructions : playerInstructions
      }`}
    >
      <Box mb={4}></Box>
      <Flex>
        <Flex
          flex="1 0 auto"
          justifyContent="flex-end"
          marginRight={`${theme.spacing(2)}px`}
        >
          <Typography
            variant="h2"
            color="secondary"
            style={{ fontWeight: score.orange > score.blue ? 600 : 400 }}
          >
            {score.orange}
          </Typography>
        </Flex>
        <Flex flex="1 0 auto" marginLeft={`${theme.spacing(2)}px`}>
          <Typography
            variant="h2"
            color="primary"
            style={{ fontWeight: score.blue > score.orange ? 600 : 400 }}
          >
            {score.blue}
          </Typography>
        </Flex>
      </Flex>
      {isHost && (
        <>
          <Box mb={8}></Box>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={restartGame}
          >
            Play Again!
          </Button>
        </>
      )}
    </ActionPage>
  );
};

const Row = styled(Flex)`
  flex-direction: column;
  margin-bottom: ${theme.spacing(2)}px;
`;
