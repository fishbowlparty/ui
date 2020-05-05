import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Box,
} from "@material-ui/core";
import { Check, Edit } from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback } from "react";
import { Link, Redirect, useRouteMatch } from "react-router-dom";
import { useGameSelector } from "../../../../redux";
import { selectOrderedPlayers } from "@fishbowl/common";

import { getPlayer } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { AdvancePhaseButton } from "../../components/AdvancePhaseButton";
import { PlayerTable, PlayerTableRow } from "../../components/PlayerTable";
import { Title, Instructions } from "../../../../components/Typography";

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
      <Flex
        flex="1 0 auto"
        flexDirection="column"
        marginBottom={`${theme.spacing(2)}px`}
      >
        <Title small>Writing Cards</Title>
        <PlayerTable>
          <TableBody>
            {orderedPlayers.map((player, i) => (
              <PlayerTableRow key={player.id}>
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
                    <IconButton style={{ margin: "-16px" }} disabled>
                      {playerHasCards(player.id) && <Check></Check>}
                    </IconButton>
                  )}
                </TableCell>
              </PlayerTableRow>
            ))}
          </TableBody>
        </PlayerTable>
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
