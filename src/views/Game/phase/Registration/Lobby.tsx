import styled from "@emotion/styled";
import { Button, IconButton, List, Typography } from "@material-ui/core";
import { RemoveCircleOutline } from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useEffect } from "react";
import { Link, useHistory, useRouteMatch, Redirect } from "react-router-dom";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer, setPlayerName } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";

export const Lobby: React.FC = () => {
  const { id, name } = getPlayer();

  const dispatch = useActionDispatch();
  const history = useHistory();
  const match = useRouteMatch<{
    gameCode: string;
  }>();
  const { url } = match;

  const hostId = useGameSelector((game) => game.hostId);
  const players = useGameSelector((game) => game.players);
  const isHost = id === hostId;
  const isMe = useCallback((playerId: string) => id === playerId, [id]);

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
      <Flex
        alignItems="center"
        justifyContent="center"
        marginBottom={`${theme.spacing(2)}px`}
      >
        <Button variant="outlined" fullWidth>
          <Flex flexDirection="column" alignItems="center">
            <Typography variant="h5">{match.params.gameCode}</Typography>
            <Typography variant="caption" align="center" color="textSecondary">
              copy invite link
            </Typography>
          </Flex>
        </Button>
      </Flex>
      <Flex flexDirection="column" marginBottom={`${theme.spacing(2)}px`}>
        <Flex alignItems="center" justifyContent="space-between">
          <Label>Rules</Label>
          {isHost && (
            <Button component={Link} to={`${url}/settings`} color="secondary">
              Change Rules
            </Button>
          )}
        </Flex>
        <Typography>
          3 rounds, 3 cards per player, 45 seconds per turn, -1 for skips
        </Typography>
      </Flex>

      <Flex flex="1 0 auto" flexDirection="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Label>Players</Label>
          <Button component={Link} to={`${url}/register`} color="secondary">
            Change My Name
          </Button>
        </Flex>
        <List>
          {players.map((player) => (
            <Flex
              key={player.id}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>{player.name || "..."}</Typography>
              {isHost && !isMe(player.id) && (
                <IconButton
                  onClick={() => removeFromGame(player.id)}
                  color="secondary"
                >
                  <RemoveCircleOutline></RemoveCircleOutline>
                </IconButton>
              )}
            </Flex>
          ))}
        </List>
      </Flex>
      <Flex>
        <Button fullWidth variant="outlined" color="primary">
          Start Game
        </Button>
      </Flex>
    </Flex>
  );
};

const Label: React.FC = ({ children }) => (
  <Typography style={{ fontWeight: 300 }} color="textSecondary" variant="h6">
    {children}
  </Typography>
);

const Header = styled(Flex)`
  flex-direction: column;
  border-bottom: 1px solid ${theme.palette.divider};
  padding-bottom: ${theme.spacing(1)}px;
  margin-bottom: ${theme.spacing(2)}px;
`;
