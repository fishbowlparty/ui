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
} from "@material-ui/core";
import { Remove, Check, Edit } from "@material-ui/icons";
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

export const Lobby: React.FC = () => {
  const { id } = getPlayer();

  const { params } = useRouteMatch<{ gameCode: string }>();

  const players = useGameSelector((game) => game.players);
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
        <List
          style={{ border: `1px solid ${theme.palette.divider}` }}
          disablePadding
        >
          {players.map((player, i) => (
            <React.Fragment key={player.id}>
              <ListItem key={player.id}>
                <ListItemText primary={player.name || "..."}></ListItemText>
                <ListItemSecondaryAction>
                  {player.id === id ? (
                    <IconButton
                      component={Link}
                      to={`/games/${params.gameCode}/cards`}
                    >
                      <Edit></Edit>
                    </IconButton>
                  ) : (
                    playerHasCards(player.id) && <Check></Check>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              {i + 1 < players.length && <Divider></Divider>}
            </React.Fragment>
          ))}
        </List>
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
