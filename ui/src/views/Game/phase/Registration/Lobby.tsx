import { selectOrderedPlayers } from "@fishbowl/common";
import { IconButton, TableBody, TableCell, Box } from "@material-ui/core";
import { Close, Edit, Settings } from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useEffect } from "react";
import { Link, Redirect, useRouteMatch } from "react-router-dom";
import { Instructions, Title } from "../../../../components/Typography";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { AdvancePhaseButton } from "../../components/AdvancePhaseButton";
import { GameInviteButton } from "../../components/GameInviteButton";
import { PlayerTable, PlayerTableRow } from "../../components/PlayerTable";
import { LobbyPage } from "../../components/LobbyPage";

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
    <LobbyPage>
      <Flex flexDirection="column" marginBottom={`${theme.spacing(2)}px`}>
        <Title small>Game Lobby</Title>
        <GameInviteButton></GameInviteButton>
        <Box mb={1}></Box>
        {isHost && (
          <Instructions>
            You are the host. Use this invite link to let your friends join. You
            will control this game's rules and when the game starts. Have fun!
          </Instructions>
        )}
      </Flex>
      <Flex flexDirection="column" marginBottom={`${theme.spacing(2)}px`}>
        <Flex alignItems="center" justifyContent="space-between">
          <Title small>Rules</Title>
          {isHost && (
            <IconButton component={Link} to={`${url}/rules`}>
              <Settings></Settings>
            </IconButton>
          )}
        </Flex>
        <Instructions>{rulesDescription}</Instructions>
      </Flex>
      <Flex flexDirection="column">
        <Title small>Players</Title>
        <PlayerTable>
          <TableBody>
            {orderedPlayers.map((player, i) => (
              <PlayerTableRow key={player.id}>
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
              </PlayerTableRow>
            ))}
          </TableBody>
        </PlayerTable>
      </Flex>
    </LobbyPage>
  );
};
