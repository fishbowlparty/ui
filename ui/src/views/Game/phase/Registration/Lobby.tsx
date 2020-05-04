import styled from "@emotion/styled";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Close, Edit, Settings } from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Redirect, useRouteMatch } from "react-router-dom";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { selectOrderedPlayers } from "@fishbowl/common";

import { getPlayer } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { AdvancePhaseButton } from "../../components/AdvancePhaseButton";
import { GameInviteButton } from "../../components/GameInviteButton";

export const Lobby: React.FC = () => {
  const { id, name } = getPlayer();

  const dispatch = useActionDispatch();
  const match = useRouteMatch<{
    gameCode: string;
  }>();
  const { url } = match;

  const hostId = useGameSelector((game) => game.hostId);
  const orderedPlayers = useGameSelector(selectOrderedPlayers);
  const isHost = id === hostId;
  const isMe = useCallback((playerId: string) => id === playerId, [id]);

  const rulesDescription = useGameSelector((game) => {
    const {
      cardsPerPlayer,
      numberOfRounds,
      skipPenalty,
      turnDuration,
    } = game.settings;

    return [
      `${numberOfRounds} rounds`,
      `${cardsPerPlayer} cards per player`,
      `${turnDuration} second turns`,
      `skips are ${skipPenalty === -1 ? "-1 points" : "free"}`,
    ].join(", ");
  });

  useEffect(() => {
    dispatch({ type: "JOIN_GAME", payload: { playerId: id, name } });
  }, [dispatch, id, name]);

  const removeFromGame = useCallback(
    (playerId) => {
      dispatch({ type: "LEAVE_GAME", payload: { playerId } });
    },
    [dispatch]
  );

  if (name === "") {
    return (
      <Redirect to={`/games/${match.params.gameCode}/register`}></Redirect>
    );
  }

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Flex flexDirection="column" marginBottom={`${theme.spacing(2)}px`}>
        <Label>Game Lobby</Label>
        <GameInviteButton></GameInviteButton>
        {isHost && (
          <Typography variant="caption">
            You are the host. Use this invite link to let your friends join. You
            will control this game's rules and when the game starts. Have fun!
          </Typography>
        )}
      </Flex>
      <Flex flexDirection="column" marginBottom={`${theme.spacing(2)}px`}>
        <Flex alignItems="center" justifyContent="space-between">
          <Label>Rules</Label>
          {isHost && (
            <IconButton component={Link} to={`${url}/rules`}>
              <Settings></Settings>
            </IconButton>
          )}
        </Flex>
        <Typography variant="caption">{rulesDescription}</Typography>
      </Flex>

      <Flex flex="1 0 auto" flexDirection="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Label>Players</Label>
        </Flex>
        <TableContainer component={Paper}>
          <Table aria-label="Players">
            <TableBody>
              {orderedPlayers.map((player, i) => (
                <TableRow key={player.id}>
                  <TableCell scope="row">{i + 1}</TableCell>
                  <TableCell scope="row" style={{ width: "100%" }}>
                    {player.name || "..."}
                  </TableCell>
                  <TableCell align="right">
                    {isMe(player.id) ? (
                      <IconButton
                        component={Link}
                        to={`${url}/register`}
                        style={{ margin: "-16px" }}
                      >
                        <Edit></Edit>
                      </IconButton>
                    ) : (
                      isHost && (
                        <IconButton
                          onClick={() => removeFromGame(player.id)}
                          style={{ margin: "-16px" }}
                        >
                          <Close></Close>
                        </IconButton>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Flex>
      <Flex>
        <AdvancePhaseButton></AdvancePhaseButton>
      </Flex>
    </Flex>
  );
};

const Label: React.FC = ({ children }) => (
  <Typography
    style={{ fontWeight: 300, lineHeight: "36px" }}
    color="textSecondary"
    variant="h6"
  >
    {children}
  </Typography>
);

const Header = styled(Flex)`
  flex-direction: column;
  border-bottom: 1px solid ${theme.palette.divider};
  padding-bottom: ${theme.spacing(1)}px;
  margin-bottom: ${theme.spacing(2)}px;
`;
