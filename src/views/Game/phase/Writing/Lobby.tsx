import styled from "@emotion/styled";
import {
  Button,
  IconButton,
  List,
  Typography,
  Box,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { Remove, Check, Edit, Close } from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Link, useHistory, useRouteMatch, Redirect } from "react-router-dom";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer, setPlayerName } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { useDispatch } from "react-redux";
import { AdvancePhaseButton } from "../../components/AdvancePhaseButton";
import { selectOrderedPlayers } from "../../../../redux/selectors";

export const Lobby: React.FC = () => {
  const { id } = getPlayer();

  const { params } = useRouteMatch<{ gameCode: string }>();

  const orderedPlayers = useGameSelector(selectOrderedPlayers);
  const playerCards = useGameSelector((game) => game.playerCards);
  const playerHasCards = useCallback(
    (playerId: string) => playerCards[playerId] != null,
    [playerCards]
  );

  if (playerCards[id] == null) {
    return <Redirect to={`/games/${params.gameCode}/cards`}></Redirect>;
  }

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Flex flex="1 0 auto" flexDirection="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Label>Writing Cards...</Label>
        </Flex>
        <TableContainer component={Paper}>
          <Table aria-label="Players">
            <TableBody>
              {orderedPlayers.map((player, i) => (
                <TableRow key={player.id}>
                  <TableCell scope="row" style={{ width: "100%" }}>
                    {player.name}
                  </TableCell>
                  <TableCell align="right">
                    {player.id === id ? (
                      <IconButton
                        component={Link}
                        to={`/games/${params.gameCode}/cards`}
                        style={{ margin: "-16px" }}
                      >
                        <Edit></Edit>
                      </IconButton>
                    ) : (
                      playerHasCards(player.id) && <Check></Check>
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
