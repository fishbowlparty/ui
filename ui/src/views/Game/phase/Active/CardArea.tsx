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

  const isTurnFresh = useGameSelector((game) => game.turns.active.isFresh);
  const isGameFresh = useGameSelector((game) => game.isFresh);
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
  const pointTotal = recap.cardEvents.reduce(
    (sum, cardEvent) => sum + (cardEvent == null ? skipPenalty : 1),
    0
  );

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

  if (isTurnFresh) {
    const teamColor =
      theme.palette[recap.team === "orange" ? "secondary" : "primary"].main;

    return (
      <Centered>
        <CardTitle>turn recap</CardTitle>
        <Box mb={1}></Box>
        <TableContainer
          component={Paper}
          variant="outlined"
          style={{ borderColor: teamColor, marginBottom: theme.spacing(1) }}
        >
          <Table aria-label="Players">
            <TableBody>
              {recap.cardEvents.map((cardId, i) => {
                const isSkip = cardId == null;

                return (
                  <PlayerTableRow key={i}>
                    <TableCell scope="row">
                      {cardId == null ? (
                        <Typography
                          variant="body2"
                          style={{ fontWeight: 300, fontStyle: "italic" }}
                          color="textSecondary"
                        >
                          skipped
                        </Typography>
                      ) : (
                        cards[cardId].text
                      )}
                    </TableCell>
                    <TableCell scope="row" align="right">
                      {cardId == null ? (
                        skipPenalty == 0 ? null : (
                          <Typography variant="subtitle2" color="textSecondary">
                            - 1
                          </Typography>
                        )
                      ) : (
                        <Typography variant="subtitle2">+ 1</Typography>
                      )}
                    </TableCell>
                  </PlayerTableRow>
                );
              })}
              <PlayerTableRow>
                <TableCell scope="row" align="right"></TableCell>
                <TableCell scope="row" align="right">
                  <Typography
                    variant="subtitle2"
                    color={recap.team == "orange" ? "secondary" : "primary"}
                  >
                    = {pointTotal}
                  </Typography>
                </TableCell>
              </PlayerTableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
