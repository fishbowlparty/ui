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
  ListSubheader,
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
import { useActionDispatch, useGameSelector } from "../../../redux";
import { getPlayer, setPlayerName } from "../../../redux/localStorage";
import { theme } from "../../../theme";
import { useDispatch, useSelector } from "react-redux";
import { AdvancePhaseButton } from "../components/AdvancePhaseButton";

export const Drafting: React.FC = () => {
  const { id } = getPlayer();

  const { params } = useRouteMatch<{ gameCode: string }>();

  const players = useGameSelector((game) => game.players);
  const teams = useGameSelector((game) => game.teams);
  const lookupPlayer = (id: string) => players.find((p) => p.id === id);

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Flex
        flex="1 0 auto"
        flexDirection="column"
        paddingBottom={theme.spacing(2)}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Label>Choose Your Teams...</Label>
        </Flex>
        <Flex>
          <Flex flex="1 1 0%">
            <List
              style={{
                border: `1px solid ${theme.palette.divider}`,
                width: "100%",
              }}
              disablePadding
            >
              <Divider></Divider>
              {teams.orange.map((playerId, i) => (
                <React.Fragment key={playerId}>
                  <ListItem key={playerId}>
                    <ListItemText
                      primaryTypographyProps={{
                        color: "secondary",
                      }}
                      primary={lookupPlayer(playerId)?.name || "..."}
                    ></ListItemText>
                  </ListItem>
                  {i + 1 < players.length && <Divider></Divider>}
                </React.Fragment>
              ))}
            </List>
          </Flex>
          <Flex flex="1 1 0%">
            <List
              style={{
                border: `1px solid ${theme.palette.divider}`,
                width: "100%",
              }}
              disablePadding
            >
              <Divider></Divider>
              {teams.blue.map((playerId, i) => (
                <React.Fragment key={playerId}>
                  <ListItem key={playerId}>
                    <ListItemText
                      primaryTypographyProps={{
                        color: "primary",
                      }}
                      primary={lookupPlayer(playerId)?.name || "..."}
                    ></ListItemText>
                  </ListItem>
                  {i + 1 < players.length && <Divider></Divider>}
                </React.Fragment>
              ))}
            </List>
          </Flex>
        </Flex>
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
