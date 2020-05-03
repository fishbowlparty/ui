import React, { useCallback } from "react";
import { useGameSelector, useActionDispatch } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../../../../theme";
import { Box, Typography, Button } from "@material-ui/core";
import {
  selectActivePlayer,
  selectCards,
  selectIsNewTurn,
} from "@fishbowl/common";
import { TimerContextProvider, useTimerContext } from "./timer";
import { ActionButtons } from "./ActionButtons";
import { useRouteMatch } from "react-router-dom";
import { GameInviteButton } from "../../components/GameInviteButton";
import { GameHeader } from "./GameHeader";

export const CardArea: React.FC = () => {
  const { id } = getPlayer();

  const isNewTurn = useGameSelector(selectIsNewTurn);
  const isMyTurn = useGameSelector(
    (game) => selectActivePlayer(game).id === id
  );

  const recap = useGameSelector((game) => game.turns.recap);
  const skipPenalty = useGameSelector((game) => game.settings.skipPenalty);
  const cards = useGameSelector(selectCards);
  const activeCard = useGameSelector(
    (game) => selectCards(game)[game.turns.active.activeCardId]
  );

  if (isNewTurn) {
    if (recap == null) {
      return (
        <Flex flex="1 0 auto" flexDirection="column">
          <Flex flex="1 1 0%"></Flex>
          <Box m={2}>
            <Typography variant="h4" align="center">
              Hey whats up welcome to a new game
            </Typography>
          </Box>
          <Flex flex="2 2 0%"></Flex>
        </Flex>
      );
    }

    return (
      <Flex flexDirection="column">
        <Typography variant="h6" align="center">
          {recap.team} team got{" "}
          {recap.guessedCardIds.length + recap.skippedCardCount * skipPenalty}{" "}
          points.
        </Typography>
        {recap.guessedCardIds.map((cardId) => (
          <Typography key={cardId}>{cards[cardId].text}</Typography>
        ))}
        {recap.skippedCardCount > 0 && (
          <Typography variant="caption" color="textSecondary">
            {recap.skippedCardCount} skipped
          </Typography>
        )}
      </Flex>
    );
  }

  if (isMyTurn) {
    return (
      <Typography variant="h4" align="center">
        {activeCard?.text}
      </Typography>
    );
  }
  return null;
};
