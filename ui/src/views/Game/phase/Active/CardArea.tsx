import React, { useCallback } from "react";
import { useGameSelector, useActionDispatch } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../../../../theme";
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
} from "@material-ui/core";
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
import { Title } from "../../../../components/Typography";
import { StretchPaper } from "../../components/StretchPaper";
import { PlayerTableRow } from "../../components/PlayerTable";

export const CardArea: React.FC = () => {
  const { id } = getPlayer();

  const isFresh = useGameSelector((game) => game.turns.active.isFresh);
  const isMyTurn = useGameSelector(
    (game) => selectActivePlayer(game).id === id
  );

  const activePlayer = useGameSelector(selectActivePlayer);
  const recap = useGameSelector((game) => game.turns.recap);
  const skipPenalty = useGameSelector((game) => game.settings.skipPenalty);
  const cards = useGameSelector(selectCards);
  const activeCard = useGameSelector(
    (game) => selectCards(game)[game.turns.active.activeCardId]
  );
  const isPaused = useGameSelector((game) => game.turns.active.paused);

  if (isFresh) {
    if (recap == null) {
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

    const borderColor =
      theme.palette[recap.team === "orange" ? "secondary" : "primary"].main;

    return (
      <Centered>
        <CardTitle>
          {recap.team} team got{" "}
          {recap.guessedCardIds.length + recap.skippedCardCount * skipPenalty}{" "}
          points.
        </CardTitle>
        <Box mb={1}></Box>
        {recap.guessedCardIds.length > 0 && (
          <TableContainer
            component={Paper}
            variant="outlined"
            style={{ borderColor, marginBottom: theme.spacing(1) }}
          >
            <Table aria-label="Players">
              <TableBody>
                {recap.guessedCardIds.map((cardId, i) => (
                  <PlayerTableRow key={cardId}>
                    <TableCell scope="row" style={{ width: "100%" }}>
                      {cards[cardId].text}
                    </TableCell>
                  </PlayerTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {recap.skippedCardCount > 0 && (
          <Typography variant="caption" color="textSecondary" align="right">
            {recap.skippedCardCount} skips
          </Typography>
        )}
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
