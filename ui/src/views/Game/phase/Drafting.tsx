import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableRow,
  Divider,
  Box,
  Button,
  IconButton,
} from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { useActionDispatch, useGameSelector } from "../../../redux";
import { Player, TeamName, selectHost } from "@fishbowl/common";

import { getPlayer } from "../../../redux/localStorage";
import { theme } from "../../../theme";
import { AdvancePhaseButton } from "../components/AdvancePhaseButton";
import { PlayerTableRow } from "../components/PlayerTable";
import { Title, Instructions } from "../../../components/Typography";
import styled from "@emotion/styled";
import { LobbyPage } from "../components/LobbyPage";
import { GameInviteButton } from "../components/GameInviteButton";
import { Shuffle } from "@material-ui/icons";

// https://javascript.info/task/shuffle
function shuffle<T>(array: Array<T>) {
  array = array.slice();
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/*
Make color neutral when dragging or change when crossing borders
Try different list border colors
Think about List with and without borders across this and the lobby
*/
export const Drafting: React.FC = () => {
  const { id } = getPlayer();
  const host = useGameSelector(selectHost);
  const playerIds = useGameSelector((game) => Object.keys(game.players));
  const isHost = host?.id === id;

  const teams = useGameSelector((game) => game.teams);
  const dispatch = useActionDispatch();

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    console.log(result);
    const { draggableId, source, destination } = result;
    if (destination?.droppableId == null) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const src = source.droppableId as TeamName;
    const dst = destination.droppableId as TeamName;
    const nextTeams = {
      orange: [...teams.orange],
      blue: [...teams.blue],
    };
    nextTeams[src].splice(source.index, 1);
    nextTeams[dst].splice(destination.index, 0, draggableId);

    dispatch({ type: "SET_TEAMS", payload: { teams: nextTeams } });
  };

  const shuffleTeams = useCallback(() => {
    const shuffledPlayerIds = shuffle(playerIds);
    const orange = shuffledPlayerIds.slice(
      0,
      Math.ceil(shuffledPlayerIds.length / 2)
    );
    const blue = shuffledPlayerIds.slice(
      Math.ceil(shuffledPlayerIds.length / 2)
    );

    dispatch({
      type: "SET_TEAMS",
      payload: {
        teams: {
          orange,
          blue,
        },
      },
    });
  }, [playerIds]);

  return (
    <LobbyPage>
      <Flex justifyContent="space-between" alignItems="center">
        <Title small>Choose Teams</Title>
        <GameInviteButton small></GameInviteButton>
      </Flex>
      <Flex justifyContent="space-between" alignItems="baseline">
        <Instructions>
          {isHost
            ? "Drag and drop to arrange teams"
            : `${host?.name} will arrange the teams.`}
        </Instructions>
      </Flex>
      <Flex justifyContent="flex-end">
        <IconButton onClick={shuffleTeams}>
          <Shuffle></Shuffle>
        </IconButton>
      </Flex>
      <Box mb={1}></Box>
      <Flex>
        <DragDropContext onDragEnd={onDragEnd}>
          <Flex flex="1 1 0%" marginRight={2}>
            <TeamDroppable team="orange" disabled={!isHost}></TeamDroppable>
          </Flex>
          <Flex flex="1 1 0%" marginLeft={2}>
            <TeamDroppable team="blue" disabled={!isHost}></TeamDroppable>
          </Flex>
        </DragDropContext>
      </Flex>
    </LobbyPage>
  );
};

const TeamDroppable: React.FC<{ team: TeamName; disabled?: boolean }> = ({
  team,
  disabled,
}) => {
  const players = useGameSelector((game) => game.players);
  const teams = useGameSelector((game) => game.teams);

  return (
    <Droppable droppableId={team}>
      {(provided, snapshot) => (
        <Paper
          innerRef={provided.innerRef}
          {...provided.droppableProps}
          style={{
            flex: "1 1 0%",
            boxShadow: `0px 0px 2px 1px ${
              theme.palette[team === "orange" ? "secondary" : "primary"].main
            }`,
            background: theme.palette.background.default,
            overflow: "hidden",
          }}
        >
          {teams[team].map((playerId, i) => (
            <DraggableCell
              player={players[playerId]}
              index={i}
              disabled={disabled}
            ></DraggableCell>
          ))}
          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
};

const DraggableCell: React.FC<{
  player: Player;
  index: number;
  disabled?: boolean;
}> = ({ player, index, disabled }) => {
  return (
    <Draggable
      key={player.id}
      draggableId={player.id}
      index={index}
      isDragDisabled={disabled}
    >
      {(provided, snapshot) => {
        console.log(snapshot.isDragging);
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Cell isDragging={snapshot.isDragging && !snapshot.isDropAnimating}>
              <Typography variant="body2">{player.name}</Typography>
            </Cell>
          </div>
        );
      }}
    </Draggable>
  );
};

const Cell = styled(Flex)<{ isDragging?: boolean }>`
  padding: 16px;
  transition: all 100ms ease-out;
  background: ${theme.palette.background.paper};
  border-bottom: 1px solid transparent;
  border-color: ${(p) =>
    p.isDragging ? "transparent" : theme.palette.divider};
  /* opacity: ${(p) => (p.isDragging ? 0.85 : 1)}; */
  box-shadow: ${(p) => (p.isDragging ? theme.shadows[2] : "none")};
  transform: ${(p) =>
    p.isDragging ? "perspective(100px) translateZ(5px)" : "none"};
`;
