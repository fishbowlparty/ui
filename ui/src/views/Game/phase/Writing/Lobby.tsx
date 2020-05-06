import { selectOrderedPlayers } from "@fishbowl/common";
import { IconButton, TableBody, TableCell } from "@material-ui/core";
import { Check, Edit } from "@material-ui/icons";
import React, { useCallback } from "react";
import { Link, Redirect, useRouteMatch } from "react-router-dom";
import { Title } from "../../../../components/Typography";
import { useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { LobbyPage } from "../../components/LobbyPage";
import { PlayerTable, PlayerTableRow } from "../../components/PlayerTable";
import { Flex } from "@rebass/grid/emotion";
import { GameInviteButton } from "../../components/GameInviteButton";

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
    <LobbyPage>
      <Flex justifyContent="space-between" alignItems="center">
        <Title small>Writing Cards</Title>
        <GameInviteButton small></GameInviteButton>
      </Flex>
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
    </LobbyPage>
  );
};
