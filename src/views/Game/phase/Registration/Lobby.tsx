import styled from "@emotion/styled";
import {
  Button,
  List,
  ListSubheader,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
} from "@material-ui/core";
import {
  RemoveCircleOutline,
  ShareOutlined,
  DeleteForever,
  Settings,
} from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useEffect, useState } from "react";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer, setPlayerName } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { useHistory, Link, useRouteMatch } from "react-router-dom";

export const Lobby: React.FC = () => {
  const { id, name } = getPlayer();
  const hostId = useGameSelector((game) => game.hostId);
  const players = useGameSelector((game) => game.players);
  const isHost = true;
  const dispatch = useActionDispatch();
  const match = useRouteMatch();
  const { url } = match;

  useEffect(() => {
    dispatch({ type: "JOIN_GAME", payload: { playerId: id, name } });
  }, [dispatch, id, name]);

  const onRegistration = useCallback(
    (name: string) => {
      setPlayerName(name);
      dispatch({ type: "JOIN_GAME", payload: { playerId: id, name } });
    },
    [dispatch, id]
  );

  const history = useHistory();
  // TODO: can host leave game?
  const leaveGame = useCallback(() => {
    dispatch({ type: "LEAVE_GAME", payload: { playerId: id } });
    history.push("/");
  }, [dispatch, history, id]);

  const removeFromGame = useCallback(() => {
    dispatch({ type: "LEAVE_GAME", payload: { playerId: id } });
    history.push("/");
  }, [dispatch, history, id]);

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Flex
        alignItems="center"
        justifyContent="center"
        marginBottom={`${theme.spacing(2)}px`}
      >
        <Button variant="outlined" fullWidth>
          <Flex flexDirection="column" alignItems="center">
            <Typography variant="h5">BGGO</Typography>
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
            <IconButton component={Link} to={`${url}/settings`}>
              <Settings></Settings>
            </IconButton>
          )}
        </Flex>
        <Typography>
          3 rounds; 3 cards per player; 45 seconds per turn; -1 for skips
        </Typography>
      </Flex>

      <Flex flex="1 0 auto" flexDirection="column">
        <Label>Players</Label>
        <List>
          {players.map((player) => (
            <ListItem key={player.id}>
              <ListItemText>{player.name || "..."}</ListItemText>
              <ListItemSecondaryAction>
                {player.id === id && (
                  <Button
                    color="secondary"
                    component={Link}
                    to={`${url}/register`}
                  >
                    Change Name
                  </Button>
                )}
                {isHost && (
                  <IconButton>
                    <RemoveCircleOutline></RemoveCircleOutline>
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
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
